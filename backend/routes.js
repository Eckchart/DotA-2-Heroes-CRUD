import express from "express";
import { getAllHeroes,
         getStrCategories,
         getTotalFilteredHeroesCount,
         getFilteredSortedPaginatedHeroes,
         createHero,
         updateHero,
         deleteHero,
         getAllAbilities,
         createAbility,
         updateAbility,
         deleteAbility,
         userLogin,
         userRegister } from "./controller/databaseController.js";

const router = express.Router();

// DATABASE

// HEROES
router.get("/heroes", getAllHeroes);
router.get("/heroes/bar_chart", getStrCategories);
router.get("/heroes/count", getTotalFilteredHeroesCount);  // with query
router.get("/heroes/filteredSortedCurPageItems", getFilteredSortedPaginatedHeroes);  // with query

router.post("/heroes", createHero);

router.put("/heroes/:id", updateHero);

router.delete("/heroes/:id", deleteHero);


// ABILITIES
router.get("/abilities", getAllAbilities);

router.post("/abilities", createAbility);

router.put("/abilities/:id", updateAbility);

router.delete("/abilities/:id", deleteAbility);


// USERS
router.post("/login", userLogin);
router.post("/register", userRegister);

export default router;
