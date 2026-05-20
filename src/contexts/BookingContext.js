import React, { createContext, useContext, useReducer, useCallback } from "react";
import { bookingsAPI } from "../api";
import { GET_BOOKINGS_SUCCESS, GET_BOOKINGS_FAIL } from "../actionTypes";

const BookingContext = createContext();

const bookingReducer = (state, action) => {
  switch (action.type) {
    case GET_BOOKINGS_SUCCESS:
      return {
        ...state,
        bookings: action.payload,
        loading: false,
        error: null,
      };
    case GET_BOOKINGS_FAIL:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case "SET_LOADING":
      return { ...state, loading: true };
    default:
      return state;
  }
};

const initialState = {
  bookings: [],
  loading: false,
  error: null,
};

export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const fetchBookings = useCallback(async (token) => {
    dispatch({ type: "SET_LOADING" });
    try {
      const response = await bookingsAPI.getBookings(token);
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: GET_BOOKINGS_SUCCESS, payload: data });
      } else {
        dispatch({ type: GET_BOOKINGS_FAIL, payload: "Failed to fetch bookings" });
      }
    } catch (err) {
      dispatch({ type: GET_BOOKINGS_FAIL, payload: err.message });
    }
  }, []);

  return (
    <BookingContext.Provider value={{ state, dispatch, fetchBookings }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBookings must be used within a BookingProvider");
  }
  return context;
};
