import React, { useState } from "react";
import "./estimate.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Estimate = () => {
  const make = [
    "alfa-romero",
    "audi",
    "bmw",
    "chevrolet",
    "dodge",
    "honda",
    "isuzu",
    "jaguar",
    "mazda",
    "mercedes-benz",
    "mercury",
    "mitsubishi",
    "nissan",
    "peugot",
    "plymouth",
    "porsche",
    "renault",
    "saab",
    "subaru",
    "toyota",
    "volkswagen",
    "volvo",
  ];
  const fuel_type = ["gas", "diesel"];
  const body_style = ["convertible", "hatchback", "sedan", "wagon", "hardtop"];
  const drive_wheels = ["rwd", "fwd", "4wd"];
  const engine_type = ["dohc", "ohcv", "ohc", "l", "rotor", "ohcf"];
  
  const navigate = useNavigate();
  const initialState = {
    make: "",
    fuel_type: "",
    body_style: "",
    drive_wheels: "",
    wheel_base: 0.0,
    engine_type: "",
    engine_size: 0.0,
    compression_ratio: 0.0,
    horsepower: 0.0,
    city_mpg: 0,
    highway_mpg: 0,
  };

  const [formData, setFormData] = useState(initialState);
  const [price, setPrice] = useState(0);
  const [errors, setErrors] = useState({}); // État pour les erreurs

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({}); // Réinitialiser les erreurs lorsque l'utilisateur commence à saisir
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.make) newErrors.make = "Make is required";
    if (!formData.fuel_type) newErrors.fuel_type = "Fuel type is required";
    if (!formData.body_style) newErrors.body_style = "Body style is required";
    if (!formData.drive_wheels) newErrors.drive_wheels = "Drive wheels are required";
    if (!formData.engine_type) newErrors.engine_type = "Engine type is required";
    if (formData.wheel_base <= 0) newErrors.wheel_base = "Wheel base must be greater than 0";
    if (formData.engine_size <= 0) newErrors.engine_size = "Engine size must be greater than 0";
    if (formData.compression_ratio <= 0) newErrors.compression_ratio = "Compression ratio must be greater than 0";
    if (formData.horsepower <= 0) newErrors.horsepower = "Horsepower must be greater than 0";
    if (formData.city_mpg < 0) newErrors.city_mpg = "City MPG cannot be negative";
    if (formData.highway_mpg < 0) newErrors.highway_mpg = "Highway MPG cannot be negative";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Afficher les erreurs si la validation échoue
      return;
    }
    await estimate();
  };

  const estimate = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/data", formData);
      if (response) {
        setPrice(response.data.predicted_price);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="estimate-container">
      <form className="estimate-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="make">Make:</label>
          <select name="make" id="make" value={formData.make} onChange={handleChange}>
            <option value="">Select Make</option>
            {make.map((carMake) => (
              <option key={carMake} value={carMake}>
                {carMake.toUpperCase()}
              </option>
            ))}
          </select>
          {errors.make && <span className="error">{errors.make}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="fuel_type">Fuel Type:</label>
          <select name="fuel_type" id="fuel_type" value={formData.fuel_type} onChange={handleChange}>
            <option value="">Select Fuel Type</option>
            {fuel_type.map((type) => (
              <option key={type} value={type}>
                {type.toUpperCase()}
              </option>
            ))}
          </select>
          {errors.fuel_type && <span className="error">{errors.fuel_type}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="body_style">Body Style:</label>
          <select name="body_style" id="body_style" value={formData.body_style} onChange={handleChange}>
            <option value="">Select Body Style</option>
            {body_style.map((body) => (
              <option key={body} value={body}>
                {body.toUpperCase()}
              </option>
            ))}
          </select>
          {errors.body_style && <span className="error">{errors.body_style}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="drive_wheels">Drive Wheels:</label>
          <select name="drive_wheels" id="drive_wheels" value={formData.drive_wheels} onChange={handleChange}>
            <option value="">Select Drive Wheels</option>
            {drive_wheels.map((drive) => (
              <option key={drive} value={drive}>
                {drive.toUpperCase()}
              </option>
            ))}
          </select>
          {errors.drive_wheels && <span className="error">{errors.drive_wheels}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="wheel_base">Wheel Base:</label>
          <input
            type="number"
            step="any"
            name="wheel_base"
            id="wheel_base"
            placeholder="Enter Wheel Base"
            value={formData.wheel_base}
            onChange={handleChange}
          />
          {errors.wheel_base && <span className="error">{errors.wheel_base}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="engine_type">Engine Type:</label>
          <select name="engine_type" id="engine_type" value={formData.engine_type} onChange={handleChange}>
            <option value="">Select Engine Type</option>
            {engine_type.map((engine) => (
              <option key={engine} value={engine}>
                {engine.toUpperCase()}
              </option>
            ))}
          </select>
          {errors.engine_type && <span className="error">{errors.engine_type}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="engine_size">Engine Size:</label>
          <input
            step="any"
            type="number"
            name="engine_size"
            id="engine_size"
            placeholder="Enter Engine Size"
            value={formData.engine_size}
            onChange={handleChange}
          />
          {errors.engine_size && <span className="error">{errors.engine_size}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="compression_ratio">Compression Ratio:</label>
          <input
            step="any"
            type="number"
            name="compression_ratio"
            id="compression_ratio"
            placeholder="Enter Compression Ratio"
            value={formData.compression_ratio}
            onChange={handleChange}
          />
          {errors.compression_ratio && <span className="error">{errors.compression_ratio}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="horsepower">Horsepower:</label>
          <input
            step="any"
            type="number"
            name="horsepower"
            id="horsepower"
            placeholder="Enter Horsepower"
            value={formData.horsepower}
            onChange={handleChange}
          />
          {errors.horsepower && <span className="error">{errors.horsepower}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="city_mpg">City MPG:</label>
          <input
            step="any"
            type="number"
            name="city_mpg"
            id="city_mpg"
            placeholder="Enter City MPG"
            value={formData.city_mpg}
            onChange={handleChange}
          />
          {errors.city_mpg && <span className="error">{errors.city_mpg}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="highway_mpg">Highway MPG:</label>
          <input
            step="any"
            type="number"
            name="highway_mpg"
            id="highway_mpg"
            placeholder="Enter Highway MPG"
            value={formData.highway_mpg}
            onChange={handleChange}
          />
          {errors.highway_mpg && <span className="error">{errors.highway_mpg}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input type="text" value={price.toFixed(2).toString()} readOnly />
        </div>

        <div className="buttons">
          <button onClick={() => navigate("/")}>Home</button>
          <button
            type="button"
            onClick={() => {
              setFormData(initialState);
              setPrice(0);
              setErrors({}); // Réinitialisation des erreurs
            }}
          >
            Reset
          </button>
          <button type="submit">Estimate</button>
        </div>
      </form>
    </div>
  );
};

export default Estimate;
