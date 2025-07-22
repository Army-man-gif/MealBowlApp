import "./Specific.css";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
function Contents() {
  const { bowlID } = useParams();
  const [ingredientsClicked, setingredientsClicked] = useState(true);
  const Macros = {
    "Paneer-Power-Bowl": [480, 30, 35, 20],
    "Soya-Chunk-High-Protein-Bowl": [460, 32, 30, 18],
    "Rajma-Superfood-Bowl": [470, 22, 38, 16],
    "Tofu-Stir-Fry-Bowl": [480, 28, 30, 22],
    "Eggless-Bhurji-&-Oats-Bowl": [440, 25, 35, 16],
    "Egg-Bhurji-Nutrition-Bowl": [450, 28, 25, 20],
    "Fish-&-Veggie-Grain-Bowl": [520, 36, 25, 28],
    "Chicken-Tikka-Macro-Bowl": [500, 38, 30, 22],
  };
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
      "1/2 cup mashed sweet potato or mashed potato",
      "1/4 cup steamed broccoli and beans",
      "2 tbsp roasted peanuts",
      "Sprinkle of chat masala and lemon juice",
    ],
    "Rajma-Superfood-Bowl": [
      "3/4 cup boiled rajma (kidney beans)",
      "1/2 cup cooked red rice or millets",
      "1/2 cup mixed vegetables (carrot, peas, beans)",
      "1 tsp mustard oil or ghee",
      "Toppings: Fresh coriander, cumin powder, lemon juice",
    ],
    "Tofu-Stir-Fry-Bowl": [
      "150g tofu (pan-grilled with turmeric, garlic, and pepper)",
      "1/2 cup cooked oats or barley",
      "1/4 cup capsicum, mushroom, and baby corn stir-fry",
      "1 tsp sesame oil",
      "Toppings: Toasted sesame seeds and soy sauce drizzle",
    ],
    "Eggless-Bhurji-&-Oats-Bowl": [
      "1/2 cup moong dal chilla crumble (eggless bhurji style)",
      "1/2 cup cooked masala oats",
      "1/4 cup steamed peas and cauliflower",
      "1 tsp ghee or coconut oil",
      "Toppings: Mint, lemon, roasted cumin powder",
    ],
    "Egg-Bhurji-Nutrition-Bowl": [
      "3 egg whites + 2 whole eggs (bhurji with onion, tomato, green chili)",
      "1/2 cup cooked oats or rolled oats khichdi",
      "1/4 cup steamed cauliflower or peas",
      "1 tsp ghee or butter",
      "Toppings: Mint, lemon, and flaxseed powder",
    ],
    "Fish-&-Veggie-Grain-Bowl": [
      "150g grilled fish (pomfret or salmon, spiced with turmeric, garlic)",
      "1/2 cup cooked red rice or foxtail millet",
      "1/2 avocado or 1 tsp flaxseed oil",
      "1/2 cup sautéed kale/spinach + carrots",
      "Toppings: Roasted sesame seeds, green chutney drizzle",
    ],
    "Chicken-Tikka-Macro-Bowl": [
      "150g grilled chicken tikka (marinated in curd + spices)",
      "1/2 cup cooked millets or jeera brown rice",
      "1/4 cup cucumber-tomato-onion salad",
      "1 tbsp hung curd mint dip",
      "1 tsp ghee for flavor",
    ],
  };
  const bowlInfo = information[bowlID]
    ? information[bowlID]
    : ["No ingredients found"];
  const bowlMacros = Macros[bowlID] ? Macros[bowlID] : [];
  const stopCase = "Toppings";
  const bold = { fontWeight: "bold" };
  function toggle() {
    setingredientsClicked(!ingredientsClicked);
  }
  return (
    <>
      <div className="position">
        <div className="moveAndAdjust">
          <h2 onClick={toggle} className="clickable">
            Ingredients
          </h2>
          {ingredientsClicked &&
            bowlInfo.map((value, index) => (
              <React.Fragment key={index}>
                {!value.startsWith(stopCase) && <p>{value + "\n"}</p>}
                {value.startsWith(stopCase) && (
                  <p style={bold}>{value + "\n"}</p>
                )}
              </React.Fragment>
            ))}
        </div>
      </div>
    </>
  );
}

export default Contents;
