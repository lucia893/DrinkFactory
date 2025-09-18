import RedisRepository from "../repositories/redis.repository";

// Define fórmulas por bebida: ingredientes necesarios por unidad
const RECIPES: Record<string, Record<string, number>> = {
  cosmic_punch: { sugar: 10, caffeine: 5, flavor: 3 },
  lunar_berry: { sugar: 8, caffeine: 3, flavor: 5 },
  solar_blast: { sugar: 12, caffeine: 6, flavor: 4 },
};

export class InventoryService {
  constructor(private repo: RedisRepository) {}

  getRecipe(drinkType: string) {
    return RECIPES[drinkType];
  }

  async canProduce(drinkType: string, quantity: number) {
    const recipe = this.getRecipe(drinkType);
    if (!recipe) return { ok: false, reason: "unknown_drink" };

    for (const [ingredient, perUnit] of Object.entries(recipe)) {
      const needed = perUnit * quantity;
      const available = await this.repo.getIngredientQuantity(ingredient);
      if (available < needed)
        return {
          ok: false,
          reason: "insufficient_inventory",
          ingredient,
          needed,
          available,
        };
    }
    return { ok: true };
  }

  async reserveIngredients(drinkType: string, quantity: number) {
    const recipe = this.getRecipe(drinkType);
    if (!recipe) throw new Error("unknown_recipe");

    // Nota: en producción, se usaría script LUA para decrementar de forma atómica. Aquí decrementamos secuencial.
    for (const [ingredient, perUnit] of Object.entries(recipe)) {
      const amount = perUnit * quantity;
      await this.repo.reserveIngredient(ingredient, amount);
    }
  }
}
