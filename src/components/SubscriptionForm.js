import addToMailchimp from "gatsby-plugin-mailchimp";
import React, { useState } from "react";

const SubscriptionForm = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState(false);
  let _handleSubmit = async (e) => {
    console.log(e);
    const result = await addToMailchimp(email, { FNAME: firstName });
    console.log(result);
    setStatus(result);
    // I recommend setting `result` to React state
    // but you can do whatever you want
  };

  return (
    <div style={{ textAlign: "center", margin: "50px 0px" }}>
      <h3>Subscribe to never miss another article!</h3>
      {!status && (
        <React.Fragment>
          <input
            style={{ margin: "10px" }}
            type="email"
            id="email"
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <input
            style={{ margin: "10px" }}
            type="text"
            id="name"
            placeholder="First name"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
          />
          <button style={{ margin: "10px" }} onClick={_handleSubmit}>
            Let's do this!
          </button>
        </React.Fragment>
      )}
      {status && status.result === "success" && <p>{status.msg}</p>}
      {status && status.result === "error" && (
        <div>
          <p style={{ color: "red" }}>
            An error occured. Are you sure you are not already subscribed? If
            that's not the case, send me an email at
            damcossetfreelance@gmail.com to fix this ;)
          </p>
          <p
            onClick={() => setStatus(false)}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            Try again
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionForm;
