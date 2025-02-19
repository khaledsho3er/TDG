import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Header from "../Components/navBar";
import { Link, useParams } from "react-router-dom";
import PageDicription from "../Components/Topheader";
import LoadingScreen from "./loadingScreen";

function Types() {
  const { subCategoryId } = useParams();
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `https://tdg-db.onrender.com/api/types/subcategories/${subCategoryId}/types`
        );
        setTypes(data);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching types");
      } finally {
        setLoading(false);
      }
    };

    fetchTypes();
  }, [subCategoryId]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <Box>Error: {error}</Box>;
  }

  return (
    <Box>
      <Header />
      <PageDicription category={{ name: subCategoryName }} />
      {types.length > 0 ? (
        <Box className="types-container">
          {types.map((type) => (
            <Link
              to={`/products/types/${type._id}/${type.name}`}
              key={type._id}
              className="type-card"
              style={{
                backgroundImage: `url(https://tdg-db.onrender.com/uploads/${type.image})`,
              }}
            >
              <Box className="type-overlay">
                <Typography variant="h3" className="type-title">
                  {type.name}
                </Typography>
              </Box>
            </Link>
          ))}
        </Box>
      ) : (
        <Box>No types found</Box>
      )}
    </Box>
  );
}

export default Types;
