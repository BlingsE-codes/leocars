import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";
import { useSearchParams, Link } from "react-router-dom";
import Pagination from "../Pages/pagination.jsx";
import imageCompression from 'browser-image-compression';



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
  const [adminEmails, setAdminEmails] = useState(new Set());

  function formatNumberWithCommas(value) {
  // Remove all non-digit chars first
  const numericValue = value.replace(/\D/g, "");
  if (!numericValue) return "";
  return Number(numericValue).toLocaleString();
}


useEffect(() => {
  const fetchAdminsAndUser = async () => {
    // Fetch admins from Supabase
    const { data: adminsData, error: adminsError } = await supabase.from("admins").select("email");
    if (adminsError) {
      console.error("Failed to fetch admins:", adminsError);
      return;
    }
    const emailsSet = new Set(adminsData.map(admin => admin.email));
    setAdminEmails(emailsSet);

    // Get logged in user
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      setUserEmail(user.email);
      setIsAdmin(emailsSet.has(user.email));
    }
  };

  fetchAdminsAndUser();
}, [adminEmails]);




  const carsPerPage = 15;
  const [activeTab, setActiveTab] = useState("view");

  const [newCar, setNewCar] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    chassis: "",
    comment: "",
    mileage: "",
  });
  const [condition, setCondition] = useState("Foreign Used");
  const [shift, setShift] = useState("Automatic");
  const [imageFile, setImageFile] = useState([]);

  const [currentImageIndex, setCurrentImageIndex] = useState({});

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        setUserEmail(user.email);
        setIsAdmin(adminEmails.has(user.email));
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

  const handleresetpage = () => {
    setCars(allCars);
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
  const { make, model, year, price, chassis, comment, mileage } = newCar;

  if (!make || !model || !year || !price || !chassis || imageFile.length === 0) {
    toast.error("Fill all fields and upload at least one image");
    return;
  }

  await toast.promise(
    (async () => {
      const imageUrls = [];

      for (const file of imageFile) {
        // ✅ Compress image on client side
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.4,               // Maximum size in MB
          maxWidthOrHeight: 900,     // Resize to max 1200px
          useWebWorker: true,         // Use web worker for faster performance
        });

        console.log(
          `Original: ${(file.size / 1024 / 1024).toFixed(2)} MB, Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`
        );

        const ext = compressedFile.name.split(".").pop();
        const name = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
        const path = `cars/${name}`;

        const { error: uploadError } = await supabase.storage
          .from("car-images")
          .upload(path, compressedFile);

        if (uploadError) {
          console.error(uploadError);
          throw new Error("Image upload failed");
        }

        const { data } = supabase.storage
          .from("car-images")
          .getPublicUrl(path);

        imageUrls.push(data.publicUrl);
      }

      const { error: insertError } = await supabase.from("cars").insert([
        {
          make,
          model,
          year: +year,
          price: +price,
          chassis,
          comment,
          condition,
          shift,
          mileage,
          image_urls: imageUrls,
          user_email: userEmail,
          created_at: new Date().toISOString()
        },
      ]);

      if (insertError) {
        console.error(insertError);
        throw new Error("Upload failed");
      }

      // ✅ Reset form
      setNewCar({
        make: "",
        model: "",
        year: "",
        price: "",
        chassis: "",
        comment: "",
        mileage: "",
      });
      setImageFile([]);
      fetchCars();
    })(),
    {
      loading: "Uploading car...",
      success: "Car uploaded successfully!",
      error: (err) => err.message || "Upload failed",
    }
  );
};




  const handleDelete = async (carId, imageUrls) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;

    for (const url of imageUrls) {
      const match = url.match(/car-images\/(.+)$/);
      if (match && match[1]) {
        const path = match[1];
        await supabase.storage.from("car-images").remove([`cars/${path}`]);
      }
    }

    const { error } = await supabase.from("cars").delete().eq("id", carId);
    if (error) {
      console.error(error);
      toast.error("Failed to delete car");
    } else {
      toast.success("Car deleted!");
      fetchCars();
    }
  };

  // ✅ BULLETPROOF Mark as Sold
  const handleMarkAsSold = async (car) => {
    if (!window.confirm(`Mark ${car.make} ${car.model} as SOLD?`)) return;

    const soldCar = {
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      chassis: car.chassis,
      condition: car.condition,
      shift: car.shift,
      comment: car.comment,
      mileage: car.mileage,
      image_urls: car.image_urls,
      user_email: car.user_email,
      sold_date: new Date().toISOString(),
      price_paid: car.price
    };

    const { error: insertError } = await supabase.from("sold_cars").insert([soldCar]);
    if (insertError) {
      console.error(insertError);
      toast.error(`Failed to mark as sold: ${insertError.message}`);
      return;
    }

    const { error: deleteError } = await supabase.from("cars").delete().eq("id", car.id);
    if (deleteError) {
      console.error(deleteError);
      toast.error(`Failed to remove car: ${deleteError.message}`);
      return;
    }

    toast.success(`${car.make} ${car.model} marked as SOLD!`);
    fetchCars();
  };

  if (loading) return <div className="loading-container">Loading cars...</div>;
  if (!cars.length) return <p>No cars available at the moment.</p>;

  return (
    <div className="search-area">
      <div className="App">
        <div style={{ marginBottom: "20px" }}>
          <select value={activeTab} onChange={(e) => setActiveTab(e.target.value)}>
            <option value="view">🚗 View Cars</option>
            {isAdmin && <option value="upload">📤 Upload Car</option>}
            
          </select>
           <button type="button" className="Search-btn" onClick={() => setActiveTab("view")}>HOME</button>
        </div>
{activeTab === "upload" && isAdmin && (
  <form onSubmit={handleUpload} className="upload-form">
   
    <h3 className="upload-title">🚗 Upload New Car</h3>

    <input type="text" placeholder="Make" value={newCar.make} onChange={(e) => setNewCar({ ...newCar, make: e.target.value })} className="upload-input" />

    <input type="text" placeholder="Model" value={newCar.model} onChange={(e) => setNewCar({ ...newCar, model: e.target.value })} className="upload-input" />

    <input type="number" placeholder="Year" value={newCar.year} onChange={(e) => setNewCar({ ...newCar, year: e.target.value })} className="upload-input" />

    <input type="text" placeholder="Price" value={newCar.priceFormatted} onChange={(e) => {const formatted = formatNumberWithCommas(e.target.value); const raw = e.target.value.replace(/,/g, "").replace(/\D/g, ""); setNewCar({ ...newCar, priceFormatted: formatted, price: raw });}} className="upload-input" />

    <input type="text" placeholder="Chassis Number" value={newCar.chassis} onChange={(e) => setNewCar({ ...newCar, chassis: e.target.value })} className="upload-input" />

    <input type="text" placeholder="Milage" value={newCar.mileage} onChange={(e) => {const formatted = formatNumberWithCommas(e.target.value);setNewCar({ ...newCar, mileage: formatted });}} className="upload-input" />

    <textarea placeholder="Comment" value={newCar.comment} onChange={(e) => setNewCar({ ...newCar, comment: e.target.value })} className="upload-textarea"></textarea>

    <div className="upload-selects">
      <select value={condition} onChange={(e) => setCondition(e.target.value)} className="upload-select">
        <option>Foreign Used</option>
        <option>Local Used</option>
      </select>

      <select value={shift} onChange={(e) => setShift(e.target.value)} className="upload-select">
        <option>Automatic</option>
        <option>Manual</option>
      </select>
    </div>

    <input type="file" multiple accept="image/*" onChange={(e) => setImageFile(Array.from(e.target.files))} className="upload-input" />

    <button type="submit" className="upload-btn">Upload 🚀</button>
  </form>
)}


        {activeTab === "view" && (
          <>
            <div className="search-bar">
              <input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <select value={filterCondition} onChange={(e) => setFilterCondition(e.target.value)}>
                <option value="All">All</option>
                <option value="Foreign Used">Foreign Used</option>
                <option value="Local Used">Local Used</option>
              </select>
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="default">Sort By</option>
                <option value="priceLowHigh">Price Low to High</option>
                <option value="priceHighLow">Price High to Low</option>
                <option value="yearNewOld">Year New-Old</option>
                <option value="yearOldNew">Year Old-New</option>
              </select>
              <button onClick={handleSearch} className="search-btn">Search</button>
              <button onClick={handleresetpage} className="reset-btn">Reset</button>
            </div>

            <div className="car-list">
              {currentCars.map((car) => (
                <div key={car.id} className="car-card">
                  {isAdmin && (
                    <div style={{ position: "relative" }}>
                      <button onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(car.id, car.image_urls);
                      }}>Delete</button>
                      <button onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleMarkAsSold(car);
                      }}>Sold</button>
                    </div>
                  )}
                  <Link to={`/car/${car.id}`}>
                    <img src={car.image_urls[currentImageIndex[car.id] || 0]} alt="car" />
                    {car.image_urls.length > 1 && (
                      <div className="image-controls">
                        <button onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handlePrevImage(car.id, car.image_urls.length);
                        }}>Prev</button>
                        <button onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleNextImage(car.id, car.image_urls.length);
                        }}>Next</button>
                      </div>
                    )}
                    <h3>{car.make} {car.model}</h3>
                    <p className="car-price">₦{Number(car.price).toLocaleString()}</p>
                    <p>{car.year}</p>
                    <p>{car.condition}</p>
                    <p>{car.chassis}</p>
                    <p>{car.comment}</p>
                    <p>{car.shift}</p>
                    <p>Mileage: {car.mileage}</p>
                    <p>Uploaded on: {car.created_at && !isNaN(Date.parse(car.created_at))? new Date(car.created_at).toLocaleDateString("en-NG", {day: "numeric", month: "short", year: "numeric",}): "Unknown"}</p>
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
    </div>
  );
}

export default Home;

