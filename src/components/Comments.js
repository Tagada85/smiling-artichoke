import React from "react";
import { Helmet } from "react-helmet";

const Comments = () => {
  return (
    <React.Fragment>
      <div id="commento"></div>
      <Helmet>
        <script defer src="https://cdn.commento.io/js/commento.js"></script>
      </Helmet>
    </React.Fragment>
  );
};

export default Comments;
