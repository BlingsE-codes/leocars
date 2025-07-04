import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";
import { useSearchParams, Link } from "react-router-dom";
import Pagination from "../Pages/pagination.jsx";

const ADMIN_EMAILS = new Set(["charlichal2@gmail.com", "jewelcharry@gmail.com"]);

function Home() {
  const [cars, setCars] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [_, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [filterCondition, setFilterCondition] = useState(searchParams.get("condition") || "All");
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "default");
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const carsPerPage = 12;

  const [activeTab, setActiveTab] = useState("view");

  const [newCar, setNewCar] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    chassis: "",
    comment: "",
  });
  const [condition, setCondition] = useState("Used");
  const [shift, setShift] = useState("Automatic");
  const [imageFile, setImageFile] = useState([]);

  // Keep track of current image index for each car
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        setUserEmail(user.email);
        setIsAdmin(ADMIN_EMAILS.has(user.email));
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!isAdmin && activeTab === "upload") {
      setActiveTab("view");
    }
  }, [isAdmin, activeTab]);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("cars").select("*");
    if (error) {
      console.error(error);
    } else {
      setCars(data);
      setAllCars(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (allCars.length) handleSearch();
  }, [allCars]);

  const handleSearch = () => {
    let filtered = allCars.filter(car =>
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.price.toString().includes(searchTerm)
    );

    if (filterCondition !== "All") {
      filtered = filtered.filter(car => car.condition === filterCondition);
    }

    switch (sortOption) {
      case "priceLowHigh":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "priceHighLow":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "yearNewOld":
        filtered.sort((a, b) => b.year - a.year);
        break;
      case "yearOldNew":
        filtered.sort((a, b) => a.year - b.year);
        break;
      default:
        break;
    }

    setCars(filtered);
    setCurrentPage(1);
    setSearchParams({
      q: searchTerm,
      condition: filterCondition,
      sort: sortOption,
      page: 1,
    });
  };

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(cars.length / carsPerPage);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    setSearchParams({
      q: searchTerm,
      condition: filterCondition,
      sort: sortOption,
      page: pageNum,
    });
  };

  const handlePrevImage = (carId, total) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [carId]: prev[carId] > 0 ? prev[carId] - 1 : total - 1
    }));
  };

  const handleNextImage = (carId, total) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [carId]: prev[carId] < total - 1 ? prev[carId] + 1 : 0
    }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const { make, model, year, price, chassis, comment } = newCar;

    if (!make || !model || !year || !price || !chassis || imageFile.length === 0) {
      toast.error("Fill all fields and upload at least one image");
      return;
    }

    const imageUrls = [];
    for (const file of imageFile) {
      const ext = file.name.split(".").pop();
      const name = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
      const path = `cars/${name}`;
       console.log("Uploading:", path);

      const { error: uploadError } = await supabase.storage.from("car-images").upload(path, file);
      if (uploadError) {
        console.error(uploadError);
        toast.error("Image upload failed");
        return;
      }

      const { data } = supabase.storage.from("car-images").getPublicUrl(path);
      imageUrls.push(data.publicUrl);
    }

    const { error: insertError } = await supabase.from("cars").insert([{
      make, model, year: +year, price: +price, chassis, comment,
      condition, shift, image_urls: imageUrls, user_email: userEmail
    }]);


    if (insertError) {
      console.error(insertError);
      toast.error("Upload failed");
    } else {
      // toast.success("Uploading car...");
      toast.loading("Uploading car...");
      // Wait for a short time to simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Car uploaded successfully!");
     
      setNewCar({ make: "", model: "", year: "", price: "", chassis: "", comment: "" });
      setImageFile([]);
      fetchCars();
     
    }
  };

  // Delete car and its images
  const handleDelete = async (carId, imageUrls) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

 

    // Delete images from storage
    for (const url of imageUrls) {
      // Extract the path after the bucket name
      const match = url.match(/car-images\/(.+)$/);
      if (match && match[1]) {
        const path = match[1];
        const { error: storageError } = await supabase.storage.from("car-images").remove([`cars/${path}`]);
        if (storageError) {
          console.error(storageError);
        }
      }
    }

    // Delete car from database
    const { error } = await supabase.from("cars").delete().eq("id", carId);
    if (error) {
      console.error(error);
      toast.error("Failed to delete car");
    } else {
      toast.success("Car deleted!");
      fetchCars();
    }
  };

  

  if (loading) return (
  <div className="loading-container">
    <span className="car-icon">🚗</span>
    <p>Loading cars...</p>
  </div>
);
  if (!cars.length) return <p className="no-cars">Check your internet connection!! No cars available at the moment.</p>;

  return (
    <div className="App">
      <div style={{ marginBottom: "20px" }}>
        <select value={activeTab} onChange={(e) => setActiveTab(e.target.value)}>
          <option value="view">🚗 View Cars</option>
          {isAdmin && <option value="upload">📤 Upload Car</option>}
        </select>
      </div>

      {activeTab === "upload" && isAdmin && (
        <form onSubmit={handleUpload} className="upload-form">
          <h3>Upload New Car</h3>
          <input type="text" placeholder="Make" value={newCar.make} onChange={(e) => setNewCar({ ...newCar, make: e.target.value })} /><br />
          <input type="text" placeholder="Model" value={newCar.model} onChange={(e) => setNewCar({ ...newCar, model: e.target.value })} /><br />
          <input type="number" placeholder="Year" value={newCar.year} onChange={(e) => setNewCar({ ...newCar, year: e.target.value })} /><br />
          <input type="number" placeholder="Price" value={newCar.price} onChange={(e) => setNewCar({ ...newCar, price: e.target.value })} /><br />
          <input type="text" placeholder="Chassis Number" value={newCar.chassis} onChange={(e) => setNewCar({ ...newCar, chassis: e.target.value })} /><br />
          <textarea placeholder="Comment" value={newCar.comment} onChange={(e) => setNewCar({ ...newCar, comment: e.target.value })}></textarea><br />
          <select value={condition} onChange={(e) => setCondition(e.target.value)}>
            <option>Used</option>
            <option>New</option>
          </select>
          <select value={shift} onChange={(e) => setShift(e.target.value)}>
            <option>Automatic</option>
            <option>Manual</option>
          </select>
          <input type="file" multiple accept="image/*" onChange={(e) => setImageFile(Array.from(e.target.files))} /><br />
          <button type="submit" className="upload-btn">Upload</button>
        </form>
      )}

      {activeTab === "view" && (
        <>
          <div className="search-bar">
            <input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select value={filterCondition} onChange={(e) => setFilterCondition(e.target.value)}>
              <option value="All">All</option>
              <option value="Used">Used</option>
              <option value="New">New</option>
            </select>
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="default">Sort By</option>
              <option value="priceLowHigh">Price Low to High</option>
              <option value="priceHighLow">Price High to Low</option>
              <option value="yearNewOld">Year New-Old</option>
              <option value="yearOldNew">Year Old-New</option>
            </select>
            <button onClick={handleSearch} className="search-btn">Search</button>
          </div>
<div className="car-list">
  {currentCars.map(car => (
    <div key={car.id} className="car-card">
      {isAdmin && (
        <button
          onClick={(e) => {
            e.preventDefault();
            handleDelete(car.id, car.image_urls);
          }}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "tomato",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "4px 8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ⛔ Delete
        </button>
      )}
      <Link to={`/car/${car.id}`}>
        <img src={car.image_urls[currentImageIndex[car.id] || 0]} alt="car" />
        {car.image_urls.length > 1 && (
          <div className="image-controls">
            <button  onClick={(e) => { e.preventDefault(); handlePrevImage(car.id, car.image_urls.length); }}>Prev</button>
            <button  onClick={(e) => { e.preventDefault(); handleNextImage(car.id, car.image_urls.length); }}>Next</button>
          </div>
        )}
        <h3>{car.make} {car.model}</h3>
        <p>₦{car.price.toLocaleString()}</p>
        <p>{car.year}</p>
        <p>Condition: {car.condition}</p>
        <p>Chassis: {car.chassis}</p>
        <p>Comment: {car.comment}</p>
        <p>Shift: {car.shift}</p>
        <p>Uploaded by: {car.user_email}</p>
     

      </Link>
    </div>
  ))}
</div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
} 


export default Home;




