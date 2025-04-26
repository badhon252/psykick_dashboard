import React from "react";

const AboutUs = () => {
  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">About Us</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md">
          Edit
        </button>
      </div>

      <div className="bg-purple-800 bg-opacity-50 rounded-lg p-6">
        <div className="text-white space-y-6 max-h-96 overflow-y-auto">
          <h2 className="text-xl font-semibold">About Us</h2>
          <p>Welcome to [Your Website Name]!</p>
          <p>
            At [Your Website Name], passionate about delivering the best gaming
            experience for all a casual gamer looking for a fun escape or a
            competitive player aiming for the topgot something for everyone. Our
            mission is to create a community where players can connect, compete,
            and have a great time.
          </p>

          <h2 className="text-xl font-semibold">Who We Are</h2>
          <p>
            We are a team of avid gamers, developers, and designers who are
            dedicated to providing high-quality games and an engaging platform.
            Our team has a diverse background in gaming and technology, and we
            work tirelessly to bring you the latest features, updates, and
            innovations. Our goal is simple: to make gaming more enjoyable and
            accessible to everyone.
          </p>
          <p>
            From action-packed adventures to strategy-driven challenges, our
            website offers a wide variety of games to keep you entertained. We
            are committed to regularly updating our content, introducing new
            features, and ensuring our platform remains safe, fun, and exciting.
          </p>

          <h2 className="text-xl font-semibold">Why Choose Us?</h2>
          <ul className="list-disc pl-8">
            <li>
              Quality Games: We carefully select and develop games that provide
              a great experience for all types of players.
            </li>
            <li>
              Community Focused: We believe that gaming is better when shared,
              so we focus on building a supportive community where players can
              connect.
            </li>
            <li>
              Innovative Features: We continuously strive to enhance your gaming
              experience through modern updates, and interactive elements.
            </li>
          </ul>

          <h2 className="text-xl font-semibold">Our Commitment to You</h2>
          <p>
            here to ensure that you have a smooth, fun, and engaging experience
            every time you visit our site. Your feedback and suggestions are
            important to us, and constantly looking for ways to improve.
          </p>
          <p>
            Thank you for visiting [Your Website Name].re excited to have you
            with us, and we hope you enjoy your gaming experience!
          </p>

          <h2 className="text-xl font-semibold">Social Links</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-white mb-1">Facebook</label>
              <input
                type="url"
                className="w-full p-2 rounded-md bg-purple-700 bg-opacity-50 border border-purple-500 text-white"
                defaultValue="https://www.facebook.com/"
              />
            </div>

            <div>
              <label className="block text-white mb-1">Twitter</label>
              <input
                type="url"
                className="w-full p-2 rounded-md bg-purple-700 bg-opacity-50 border border-purple-500 text-white"
                defaultValue="https://www.twitter.com/"
              />
            </div>

            <div>
              <label className="block text-white mb-1">Instagram</label>
              <input
                type="url"
                className="w-full p-2 rounded-md bg-purple-700 bg-opacity-50 border border-purple-500 text-white"
                defaultValue="https://www.instagram.com/"
              />
            </div>

            <div>
              <label className="block text-white mb-1">LinkedIn</label>
              <input
                type="url"
                className="w-full p-2 rounded-md bg-purple-700 bg-opacity-50 border border-purple-500 text-white"
                defaultValue="https://www.linkedin.com/"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-md">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
