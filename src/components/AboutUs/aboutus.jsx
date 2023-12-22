import React from "react";

import "../../assets/styles/aboutus.css";

export default function AboutUs({ userLogged }) {
  return (
    <div className="about-us">
      <h1>About Us</h1>
      <p>
        We are a public store where anyone can sell or buy items, using a
        bidding system to determine the price. We also offer anonymous chat with
        vendors, so you can ask questions and negotiate without having to reveal
        your identity.
      </p>

      <h3>Our Mission</h3>
      <p>
        Our mission is to provide a fair and transparent marketplace for people
        to sell and buy goods. We believe that everyone should have the
        opportunity to make money from their unwanted items, and that buyers
        should be able to find the best deals on the products they need.
      </p>

      <h3>Why Choose Us?</h3>
      <ul>
        <li>Fair and transparent bidding system</li>
        <li>Anonymous chat with vendors</li>
        <li>Wide variety of items to choose from</li>
        <li>Secure payment processing</li>
        <li>Excellent customer support</li>
      </ul>

      <h3>How It Works</h3>
      <p>
        To sell an item, simply create an account and list your item. You can
        set a starting price and bidding end date. Buyers can then browse and
        bid on your item. The highest bidder at the end of the auction will win
        the item.
      </p>

      <p>
        To buy an item, simply browse our listings and find an item you're
        interested in. You can then place a bid on the item. If your bid is the
        highest at the end of the auction, you will win the item.
      </p>

      <h3>Anonymous Chat</h3>
      <p>
        We offer anonymous chat with vendors so you can ask questions and
        negotiate without having to reveal your identity. This can be helpful if
        you're not sure if you're interested in an item, or if you want to try
        to get a better price.
      </p>

      <h3>Contact Us</h3>
      <p>
        If you have any questions or need help with anything, please don't
        hesitate to contact us. We're here to help you have a great experience
        on our platform.
      </p>
    </div>
  );
}
