import { CountIngredient } from '../models/CountIngredient'
import { Ingredient, type IngredientType } from '../models/Ingredient'
import { VolumeIngredient } from '../models/VolumeIngredient'
import { WeightedIngredient } from '../models/WeightedIngredient'

// รายการหน่วยทั้งหมดที่ผู้ใช้เลือกได้จากฟอร์ม
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
  'ตัว',
] as const

// สร้าง union type ของหน่วยจาก array ด้านบน ลดโอกาสที่ชนิดข้อมูลไม่ตรงกัน
export type IngredientUnit = (typeof INGREDIENT_UNITS)[number]

// จับคู่แต่ละหน่วยกับประเภทวัตถุดิบที่ Factory ต้องสร้าง
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
  'ตัว': 'count',
}

export function isIngredientUnit(unit: string): unit is IngredientUnit {
  // ตรวจสอบว่าหน่วยที่รับมามีอยู่ในตาราง UNIT_TYPES จริง
  return Object.hasOwn(UNIT_TYPES, unit)
}

/**
 * Factory สำหรับสร้างวัตถุดิบให้ตรงกับหน่วยที่ผู้ใช้เลือก
 *
 * ผู้เรียกไม่จำเป็นต้องรู้ว่าควร new คลาสลูกตัวใด เพราะ Factory จะแปลงหน่วยเป็น
 * ประเภท weighted, volume หรือ count แล้วคืน Ingredient ที่เหมาะสมให้เอง
 */
export class IngredientFactory {
  public static getTypeForUnit(unit: string): IngredientType {
    // ปฏิเสธหน่วยที่ระบบไม่รองรับ แทนการเดาประเภทให้ผิด
    if (!isIngredientUnit(unit)) {
      throw new Error(`Unsupported ingredient unit: ${unit}`)
    }

    // คืนประเภท weighted, volume หรือ count จากตารางจับคู่
    return UNIT_TYPES[unit]
  }

  public static create(
    name: string,
    quantity: number,
    unit: string,
  ): Ingredient {
    // ตรวจประเภทจากหน่วย แล้วซ่อนรายละเอียดการ new subclass ไว้ใน Factory
    switch (IngredientFactory.getTypeForUnit(unit)) {
      case 'weighted':
        // หน่วยน้ำหนัก เช่น กรัมและกิโลกรัม
        return new WeightedIngredient(name, quantity, unit)
      case 'volume':
        // หน่วยปริมาตร เช่น มิลลิลิตร ลิตร และช้อน
        return new VolumeIngredient(name, quantity, unit)
      case 'count':
        // หน่วยนับ เช่น ชิ้น ฟอง ลูก และตัว
        return new CountIngredient(name, quantity, unit)
    }
  }
}
