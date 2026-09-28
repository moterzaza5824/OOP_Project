import { CountIngredient } from '../models/CountIngredient'
import { Ingredient, type IngredientType } from '../models/Ingredient'
import { VolumeIngredient } from '../models/VolumeIngredient'
import { WeightedIngredient } from '../models/WeightedIngredient'

export const INGREDIENT_UNITS = [
  'กรัม',
  'กิโลกรัม',
  'มิลลิลิตร',
  'ลิตร',
  'ช้อนชา',
  'ช้อนโต๊ะ',
  'ถ้วย',
  'ชิ้น',
  'ฟอง',
  'ลูก',
] as const

export type IngredientUnit = (typeof INGREDIENT_UNITS)[number]

const UNIT_TYPES: Record<IngredientUnit, IngredientType> = {
  'กรัม': 'weighted',
  'กิโลกรัม': 'weighted',
  'มิลลิลิตร': 'volume',
  'ลิตร': 'volume',
  'ช้อนชา': 'volume',
  'ช้อนโต๊ะ': 'volume',
  'ถ้วย': 'volume',
  'ชิ้น': 'count',
  'ฟอง': 'count',
  'ลูก': 'count',
}

export function isIngredientUnit(unit: string): unit is IngredientUnit {
  return Object.hasOwn(UNIT_TYPES, unit)
}

export class IngredientFactory {
  public static getTypeForUnit(unit: string): IngredientType {
    if (!isIngredientUnit(unit)) {
      throw new Error(`Unsupported ingredient unit: ${unit}`)
    }

    return UNIT_TYPES[unit]
  }

  public static create(
    name: string,
    quantity: number,
    unit: string,
  ): Ingredient {
    switch (IngredientFactory.getTypeForUnit(unit)) {
      case 'weighted':
        return new WeightedIngredient(name, quantity, unit)
      case 'volume':
        return new VolumeIngredient(name, quantity, unit)
      case 'count':
        return new CountIngredient(name, quantity, unit)
    }
  }
}
