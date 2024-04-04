import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { listingToolData } from "../../seed/toolData";
import { usersData } from "../../seed/userData";
import { mdiMagnify } from "@mdi/js";

const Listings = () => {
  const [tools, setTools] = useState(null);
  const [users, setUsers] = useState(null);
  const [zipCode, setZipCode] = useState("02780");
  const [radius, setRadius] = useState(10);
  const [loading, setLoading] = useState(true);

  const getTools = () => {
    setTools(listingToolData);
  };

  const getUsers = () => {
    setUsers(usersData);
  };

  useEffect(() => {
    getTools();
    getUsers();
    setLoading(false);
  }, []);

  !loading && console.log(users);

  if (loading) {
    return;
  }

  return (
    <div>
      <div className="title is-5">Listings</div>
      <div className="search-bar field">
        <p className="control has-icons-right">
          <input
            className="input is-medium"
            type="text"
            placeholder="Search For Tools"
          />
          <span className="icon is-right is-clickable">
            <Icon path={mdiMagnify} size={2} />
          </span>
        </p>
      </div>
      <div className="is-size-6">
        There are{" "}
        <span className="has-text-weight-semibold is-clickable">
          {tools.length}
        </span>{" "}
        listings within{" "}
        <span className="has-text-weight-semibold is-clickable">{radius}</span>{" "}
        miles of{" "}
        <span className="has-text-weight-semibold is-clickable">{zipCode}</span>
      </div>
    </div>
  );
};

export default Listings;
