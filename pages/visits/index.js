import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import Navbar from "../../components/Navbar";

const Visits = ({ initialVisits }) => {
  const router = useRouter();

  const [visits, setVisits] = useState(initialVisits);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset current page when search term changes
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this visit?"
    );
    if (confirmDelete) {
      try {
        setLoading(true);
        const response = await fetch(
          `https://heritage.top-wp.com/api/visits/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete visit");
        }

        setVisits(visits.filter((visit) => visit.id !== id));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredVisits = visits.filter((visit) => {
    // Filter visits based on search term
    const searchTermLowerCase = searchTerm.toLowerCase();
    const user = visit.attributes.user?.toLowerCase();
    const plotNumber = visit.attributes.plotNumber?.toLowerCase();
    const id = visit.id.toString();
    const visitDate = visit.attributes.visitdate?.toLowerCase();
    const createdAt = visit.attributes.createdAt?.toLowerCase();

    return (
      !searchTerm ||
      user?.includes(searchTermLowerCase) ||
      !searchTerm ||
      plotNumber?.includes(searchTermLowerCase) ||
      !searchTerm ||
      id.includes(searchTermLowerCase) ||
      !searchTerm ||
      visitDate?.includes(searchTermLowerCase) ||
      !searchTerm ||
      createdAt?.includes(searchTermLowerCase)
    );
  });

  // Pagination variables
  const itemsPerPage = 10; // Number of items to display per page
  const totalItemsCount = filteredVisits.length;
  const totalPages = Math.ceil(totalItemsCount / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRows = filteredVisits.slice(startIndex, endIndex);

  return (
    <div>
      <Navbar />

      <div className="container">
        <h1>Visits</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Visit Date</th>
              <th>Created Date</th>
              <th>Plot Number</th>
              <th>View</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((visit) => (
              <tr key={visit.id}>
                <td>{visit.id}</td>
                <td>{visit.attributes.user}</td>
                <td>{visit.attributes.visitdate}</td>
                <td>{visit.attributes.createdAt}</td>
                <td>{visit.attributes.plotNumber}</td>
                <td>
                  <Link href={`/visits/${visit.id}`}>View</Link>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(visit.id)}
                    disabled={loadingId === visit.id} // Disable button if currently deleting this visit
                  >
                    {loadingId === visit.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination navigation */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <button
              className="pagination-button"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(1)}
            >
              {"<<"}
            </button>
            <button
              className="pagination-button"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              {"<"}
            </button>
            <button className="pagination-button active">{currentPage}</button>
            {currentPage < totalPages && (
              <button
                className="pagination-button"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                {currentPage + 1}
              </button>
            )}
            <button
              className="pagination-button"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              {">"}
            </button>
            <button
              className="pagination-button"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(totalPages)}
            >
              {">>"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Visits;

export async function getStaticProps() {
  try {
    let apiUrl = "https://heritage.top-wp.com/api/visits";
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch visits");
    }
    const data = await response.json();
    const initialVisits = data.data;
    return {
      props: {
        initialVisits,
      },
    };
  } catch (error) {
    return {
      props: {
        error: error.message,
      },
    };
  }
}
