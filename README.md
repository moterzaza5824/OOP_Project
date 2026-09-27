# Recipe & Ingredient Scaler

ระบบจัดการสูตรอาหารและคำนวณปริมาณวัตถุดิบตามจำนวนเสิร์ฟ พัฒนาด้วย React + TypeScript โดยประยุกต์ใช้แนวคิด Object-Oriented Programming (OOP) และ Builder Pattern

## Project Status

> **Current Stage: Final Integration / Testing**

ฟังก์ชันหลักของระบบสามารถใช้งานผ่าน GUI ได้แล้ว ขณะนี้อยู่ในช่วงปรับโครงสร้าง OOP, ตรวจสอบ UX/UI, ทดสอบ edge cases และเตรียมเอกสารสำหรับนำเสนอ

### ฟังก์ชันที่ทำแล้ว

- [x] สร้าง / แก้ไข / ลบสูตรอาหารผ่าน GUI
- [x] เพิ่ม / แก้ไข / ลบวัตถุดิบในสูตร
- [x] ค้นหาสูตรอาหารตามชื่อ
- [x] เรียงสูตรตามล่าสุด / ชื่อ / จำนวนเสิร์ฟ
- [x] คำนวณสัดส่วนวัตถุดิบตามจำนวนเสิร์ฟใหม่
- [x] ยืนยันก่อนลบสูตร
- [x] บันทึกและโหลดข้อมูลด้วย LocalStorage
- [x] Validation ข้อมูลพื้นฐาน
- [x] ใช้ Builder Pattern ใน application flow
- [x] ใช้ Encapsulation, Inheritance และ Polymorphism ใน core model

## Core Features

### 1. Recipe Management
ผู้ใช้สามารถ

- สร้างสูตรใหม่
- แก้ไขสูตรเดิม
- ลบสูตร
- ค้นหาสูตร
- เรียงลำดับสูตร

### 2. Ingredient Management
แต่ละสูตรสามารถมีวัตถุดิบหลายรายการ โดยระบุ

- ชื่อวัตถุดิบ
- ปริมาณ
- หน่วย
- ประเภทของวัตถุดิบ

รายการวัตถุดิบที่เพิ่มแล้วสามารถแก้ไขหรือลบได้ก่อนบันทึกสูตร

### 3. Recipe Scaling
ระบบสามารถคำนวณปริมาณวัตถุดิบใหม่จากจำนวนเสิร์ฟเป้าหมาย

สูตรที่ใช้:

```text
scaleFactor = targetServings / originalServings
newQuantity = originalQuantity * scaleFactor
```

ตัวอย่าง:

```text
Original Servings: 2
Target Servings:   6

Pork: 200 g -> 600 g
Milk: 300 ml -> 900 ml
```

### 4. Local Storage
สูตรอาหารถูกบันทึกไว้ใน LocalStorage ของ browser ทำให้ reload หน้าเว็บแล้วข้อมูลยังคงอยู่

> หากล้างข้อมูลเว็บไซต์หรือ LocalStorage สูตรที่บันทึกไว้อาจหาย

## OOP Design

### Class ที่ใช้งานจริงในระบบ

```text
Ingredient
├── SolidIngredient
└── LiquidIngredient

Recipe

RecipeBuilder
└── builds Recipe

RecipeScaler
├── uses Recipe
└── uses RecipeBuilder
```

### Encapsulation

`Recipe` ซ่อนข้อมูลภายในด้วย `private`

```ts
private name: string
private servings: number
private ingredients: Ingredient[]
```

และเข้าถึงข้อมูลผ่าน methods เช่น

```ts
getName()
getServings()
getIngredients()
```

`Ingredient` ใช้ `protected` เพื่อให้ subclass สามารถใช้งานข้อมูลภายในได้ แต่ code ภายนอกไม่สามารถเข้าถึง field โดยตรง

### Inheritance

```text
Ingredient
├── SolidIngredient
└── LiquidIngredient
```

`SolidIngredient` และ `LiquidIngredient` สืบทอดจาก `Ingredient`

### Polymorphism

Subclass override methods ของ `Ingredient`

```ts
getDisplayText()
withScaledQuantity()
```

ตัวอย่างการใช้งานใน `RecipeScaler`

```ts
ingredient.withScaledQuantity(scaleFactor)
```

`RecipeScaler` ไม่จำเป็นต้องรู้ว่า object เป็น `SolidIngredient` หรือ `LiquidIngredient` แต่เรียก method ผ่านชนิด `Ingredient` ได้โดยตรง

### Builder Pattern

`RecipeBuilder` ใช้สำหรับประกอบ Recipe ทีละขั้น โดยเฉพาะรายการ ingredients ที่มีจำนวนไม่แน่นอน

```ts
const recipe = new RecipeBuilder()
  .setName("Pancake")
  .setServings(2)
  .addIngredient(...)
  .addIngredient(...)
  .build()
```

Builder ช่วยรวมขั้นตอนการสร้างและ validation ก่อนสร้าง `Recipe` ที่สมบูรณ์

## Project Structure

```text
src/
├── components/
│   ├── DeleteConfirmModal.tsx
│   ├── Header.tsx
│   ├── RecipeCard.tsx
│   ├── RecipeForm.tsx
│   └── ScaleModal.tsx
│
├── core/
│   ├── builders/
│   │   └── RecipeBuilder.ts
│   │
│   ├── models/
│   │   ├── Ingredient.ts
│   │   ├── Liquidingredient.ts
│   │   ├── Recipe.ts
│   │   └── Solidingredient.ts
│   │
│   └── services/
│       └── RecipeScaler.ts
│
├── storage/
│   └── recipeStorage.ts
│
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

## Technology Stack

- React
- TypeScript
- Vite
- CSS
- LocalStorage
- Git / GitHub

## Team Roles

### Person 1 — OOP / Architecture Developer
รับผิดชอบ

- Core OOP architecture
- Recipe / Ingredient models
- Inheritance / Polymorphism
- RecipeBuilder
- Class Diagram
- OOP explanation สำหรับ presentation

### Person 2 — Logic Developer / Tester
รับผิดชอบ

- RecipeScaler
- Scaling logic
- Validation
- Test cases
- Edge cases
- Integration testing

### Person 3 — Frontend / UXUI Developer
รับผิดชอบ

- React GUI
- Recipe form
- Recipe cards
- Search / Sort
- Modal interactions
- LocalStorage integration
- UX/UI

สมาชิกทุกคนช่วยกันทำ Integration, Bug Fix และ Presentation

## How to Run

ติดตั้ง dependencies

```bash
npm install
```

รัน development server

```bash
npm run dev
```

ตรวจ lint

```bash
npm run lint
```

สร้าง production build

```bash
npm run build
```

## Current Improvement Tasks

ก่อน Final Presentation ทีมกำลังตรวจและปรับปรุงเรื่องต่อไปนี้

- [ ] ทบทวนความสมเหตุสมผลของ Ingredient inheritance
- [ ] พิจารณาแยก business logic ออกจาก `App.tsx`
- [ ] จัดทำ Class Diagram ให้ตรงกับ code ล่าสุด
- [ ] จัดทำ Test Case Table และทดสอบ edge cases
- [ ] ตรวจคำศัพท์ใน UI ให้สม่ำเสมอ
- [ ] ตรวจ responsive และ UX/UI
- [ ] Final integration test
- [ ] เตรียม Presentation และ Demo

## Final Demo Flow

```text
Create Recipe
    ↓
Add / Edit Ingredients
    ↓
Save
    ↓
Search / Sort
    ↓
Edit Recipe
    ↓
Scale Servings
    ↓
Reload Browser
    ↓
Load from LocalStorage
    ↓
Delete Recipe
```

## Notes

โครงสร้าง OOP และ Class Diagram ต้องอ้างอิงจาก code เวอร์ชันล่าสุดก่อนนำเสนอ หากมีการ refactor class หรือเพิ่ม RecipeManager / Ingredient subtype ใหม่ ต้องอัปเดต README และ Diagram ให้ตรงกัน
