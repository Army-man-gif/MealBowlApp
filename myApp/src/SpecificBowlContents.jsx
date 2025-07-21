import "./Specific.css";
import React from "react";
import { useParams } from "react-router-dom";
function Contents() {
  const { bowlID } = useParams();
  const information = {
    "Paneer-Power-Bowl": [
      "150g Grilled paneer (cubes, tossed with spices)",
      "1/2 cup cooked brown rice or quinoa",
      "1/4 cup boiled black chana",
      "1/2 cup sautéed bell peppers, zucchini, and spinach",
      "1 tsp olive oil",
      "Toppings: Fresh coriander, lemon juice,black pepper",
    ],
    "Soya-Chunk-High-Protein-Bowl": [
      "100g cooked soya chunks (masala sautéed)",
      "1/2 cup mashed sweet potato",
      "1/4 cup steamed broccoli and beans",
      "2 tbsp roasted peanuts",
      "Sprinkle of chat masala and lemon juice",
    ],
  };
  const bowlInfo = information[bowlID]
    ? information[bowlID]
    : ["No ingredients found"];
  return (
    <>
      <div className="position">
        <div className="moveAndAdjust">
          <h2>Ingredients</h2>
          {bowlInfo.map((value, index) => (
            <React.Fragment key={index}>
              <p>{value + "\n"}</p>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}

export default Contents;
