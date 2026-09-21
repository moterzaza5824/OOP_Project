# Recipe & Ingredient Scaler

ระบบจัดการสูตรอาหารและคำนวณปริมาณวัตถุดิบตามจำนวนเสิร์ฟ พัฒนาด้วย React, TypeScript และหลักการ Object-Oriented Programming (OOP) โดยใช้ Builder Pattern สำหรับสร้างสูตรอาหาร

## Project Status

> **Current Stage: Person 1 — Architecture / OOP / Builder**

ขณะนี้โปรเจกต์อยู่ในขั้นพัฒนาโครงสร้าง OOP และ Core Model ยังไม่ถึงขั้นพัฒนา GUI หรือ Integration

### ทำแล้ว

- [x] สร้าง GitHub repository
- [x] ตั้งค่า React + TypeScript + Vite
- [x] สร้าง base class `Ingredient`
- [x] สร้าง `SolidIngredient` และ `LiquidIngredient`
- [x] เพิ่ม validation สำหรับชื่อ ปริมาณ และหน่วย
- [x] แสดง Encapsulation, Inheritance และ Polymorphism เบื้องต้น

> หมายเหตุ: โค้ด Ingredient ปัจจุบันอยู่ใน branch `dew` และต้อง merge เข้า `main` หลังตรวจสอบเสร็จ

### กำลังทำในขั้น Person 1

- [ ] สร้าง `Recipe`
- [ ] สร้าง `MainDishRecipe` และ `DessertRecipe`
- [ ] สร้าง `RecipeBuilder`
- [ ] ทดลองสร้าง Recipe ผ่าน Builder Pattern
- [ ] ตรวจให้มี class ที่ออกแบบเองอย่างน้อย 5 class
- [ ] จัดทำ Class Diagram
- [ ] Merge งาน Core OOP เข้า `main`

### ขั้นถัดไป

- [ ] Person 2: พัฒนา `RecipeScaler`, validation และ test cases
- [ ] Person 3: พัฒนา GUI และเชื่อม GUI เข้ากับ Core Logic
- [ ] เพิ่ม Recipe CRUD: Add / Edit / Delete / View
- [ ] เพิ่ม Search และ LocalStorage
- [ ] Integration Testing และแก้บั๊ก
- [ ] เตรียม README, Class Diagram, Presentation และ Demo

## Core Features

- สร้างและจัดการสูตรอาหาร
- เพิ่มวัตถุดิบพร้อมปริมาณและหน่วย
- ระบุจำนวนเสิร์ฟเริ่มต้นและจำนวนเสิร์ฟเป้าหมาย
- คำนวณปริมาณวัตถุดิบตามจำนวนเสิร์ฟใหม่
- เพิ่ม แก้ไข ลบ ดู และค้นหาสูตรอาหารผ่าน GUI
- บันทึกข้อมูลด้วย LocalStorage

ตัวอย่างการคำนวณ:

```text
Original Servings: 2
Target Servings:   6
Scale Factor:      6 / 2 = 3

Pork:       200 g  -> 600 g
Fish Sauce:  10 ml ->  30 ml
```

## OOP Design

โครงสร้าง class ที่วางแผนไว้:

```text
Ingredient
├── SolidIngredient
└── LiquidIngredient

Recipe
├── MainDishRecipe
└── DessertRecipe

RecipeBuilder
RecipeScaler
RecipeManager
RecipeStorage
```

หลักการ OOP ที่ใช้:

- **Encapsulation:** ป้องกันการแก้ไขข้อมูลภายในโดยตรง และเข้าถึงผ่าน method
- **Inheritance:** class ลูกสืบทอดคุณสมบัติและพฤติกรรมจาก base class
- **Polymorphism:** class ลูก override method และถูกใช้งานผ่านชนิดของ base class
- **Abstraction:** แยกความรับผิดชอบของ Model, Builder, Service, Storage และ UI
- **Builder Pattern:** สร้าง Recipe ทีละส่วนแทน constructor ที่มี parameter จำนวนมาก

ตัวอย่างเป้าหมายการใช้งาน Builder:

```ts
const recipe = new RecipeBuilder()
  .setName("Pad Kra Pao")
  .setServings(2)
  .addIngredient(new SolidIngredient("Pork", 200, "g"))
  .addIngredient(new LiquidIngredient("Fish Sauce", 10, "ml"))
  .build()
```

## Team Roles

### Person 1 — Architecture / OOP / Builder Developer

- ออกแบบ Architecture และ Class Diagram
- พัฒนา `Recipe` และประเภทของ Recipe
- พัฒนา `RecipeBuilder`
- ดูแล Inheritance, Polymorphism และ Builder Pattern
- เตรียมคำอธิบายโครงสร้าง OOP สำหรับการนำเสนอ

### Person 2 — Logic Developer / Tester

- พัฒนาและตรวจสอบ `Ingredient`
- พัฒนา `RecipeScaler`
- เขียนสูตรคำนวณ Scaling
- ดูแล validation และ edge cases
- สร้าง test cases และตรวจสอบความถูกต้องของระบบ

### Person 3 — Frontend Developer / UX/UI

- พัฒนา GUI ด้วย React
- ทำฟอร์ม Recipe และ Ingredient
- พัฒนา Recipe List, Search และ CRUD
- เชื่อม UI เข้ากับ Builder และ Scaler
- ดูแล LocalStorage และปรับปรุง UX/UI

สมาชิกทุกคนต้องมี commit ของตนเองและช่วยกันทำ Integration และ Testing

## Planned Project Structure

```text
src/
├── components/
│   ├── RecipeForm.tsx
│   ├── IngredientForm.tsx
│   ├── IngredientList.tsx
│   ├── RecipeList.tsx
│   └── RecipeResult.tsx
├── core/
│   ├── models/
│   │   ├── Ingredient.ts
│   │   ├── SolidIngredient.ts
│   │   ├── LiquidIngredient.ts
│   │   ├── Recipe.ts
│   │   ├── MainDishRecipe.ts
│   │   └── DessertRecipe.ts
│   ├── builders/
│   │   └── RecipeBuilder.ts
│   └── services/
│       ├── RecipeScaler.ts
│       └── RecipeManager.ts
├── storage/
│   └── RecipeStorage.ts
├── App.tsx
└── main.tsx
```

## Technology Stack

- TypeScript
- React
- Vite
- CSS
- LocalStorage
- Git and GitHub

## How to Run

```bash
npm install
npm run dev
```

เปิด URL ที่ Vite แสดงใน Terminal

ตรวจสอบคุณภาพโค้ดและ production build:

```bash
npm run lint
npm run build
```

## Definition of Done

โปรเจกต์ถือว่าเสร็จเมื่อ:

- [ ] Recipe CRUD ใช้งานได้ผ่าน GUI
- [ ] เพิ่ม Ingredient และ Scale ปริมาณได้ถูกต้อง
- [ ] Search และ LocalStorage ใช้งานได้
- [ ] มี class ที่ออกแบบเองอย่างน้อย 5 class
- [ ] แสดง Encapsulation, Inheritance และ Polymorphism ชัดเจน
- [ ] ใช้ Builder Pattern จริงใน Application Flow
- [ ] ผ่าน validation และ test cases หลัก
- [ ] มี Class Diagram และ README ที่ตรงกับโค้ดจริง
- [ ] สมาชิกทั้ง 3 คนมี meaningful commits
- [ ] Demo ได้โดยไม่มี error
