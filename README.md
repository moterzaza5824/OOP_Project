# OOP_Project
# Recipe & Ingredient Scaler

ระบบจัดการสูตรอาหารและคำนวณปริมาณวัตถุดิบตามจำนวนเสิร์ฟที่ผู้ใช้ต้องการ

## Project Overview

โปรเจกต์นี้เป็น Mini Project ที่พัฒนาโดยใช้หลักการ Object-Oriented Programming (OOP) และ Builder Pattern

ผู้ใช้สามารถ

- สร้างสูตรอาหาร
- เพิ่มวัตถุดิบ
- ระบุปริมาณและหน่วยของวัตถุดิบ
- กำหนดจำนวนเสิร์ฟเริ่มต้น
- กำหนดจำนวนเสิร์ฟใหม่
- ให้ระบบคำนวณปริมาณวัตถุดิบใหม่อัตโนมัติ

ตัวอย่าง

```text
Original Servings: 2

Egg    2 pcs
Flour  200 g
Milk   300 ml
```

เมื่อเปลี่ยนเป็น 4 servings

```text
Egg    4 pcs
Flour  400 g
Milk   600 ml
```

## Objectives

- ฝึกการออกแบบโปรแกรมด้วย OOP
- ประยุกต์ใช้ Builder Pattern
- แยก Core Logic ออกจาก UI
- พัฒนาเว็บแอปที่ใช้งานได้จริง
- ฝึกการทำงานร่วมกันผ่าน Git และ GitHub

## Technology Stack

- TypeScript
- React
- Vite
- CSS
- Git
- GitHub
- Visual Studio Code

## Main System Flow

```text
User Input
↓
RecipeBuilder
↓
Recipe
↓
RecipeScaler
↓
Scaled Recipe
↓
Display Result
```

## Main Classes

```text
Ingredient
├── name
├── quantity
└── unit

Recipe
├── name
├── servings
└── ingredients[]

RecipeBuilder
├── setName()
├── setServings()
├── addIngredient()
└── build()

RecipeScaler
└── scale()
```

## Team Roles

### Person 1 — Core Developer

รับผิดชอบ

- OOP
- Core Logic
- Ingredient
- Recipe
- RecipeBuilder
- RecipeScaler
- Validation
- Builder Pattern

### Person 2 — Integration / Support / Documentation

รับผิดชอบ

- GitHub Repository
- Integration
- Manual Testing
- Bug Tracking
- README
- Documentation
- Diagram
- ช่วยงานส่วนที่ติดขัด

### Person 3 — Frontend / UI Developer

รับผิดชอบ

- React
- User Interface
- Form
- Components
- CSS
- แสดงผลลัพธ์
- เชื่อม UI กับ Core Logic

## Project Structure

โครงสร้างเบื้องต้นที่วางไว้

```text
src/
├── components/
│   ├── RecipeForm.tsx
│   ├── IngredientForm.tsx
│   ├── IngredientList.tsx
│   └── RecipeResult.tsx
│
├── core/
│   ├── models/
│   │   ├── Ingredient.ts
│   │   └── Recipe.ts
│   │
│   ├── builders/
│   │   └── RecipeBuilder.ts
│   │
│   └── services/
│       └── RecipeScaler.ts
│
├── App.tsx
└── main.tsx
```

โครงสร้างนี้สามารถปรับได้ตามการพัฒนาจริง

## Current Status

- [x] Create GitHub Repository
- [ ] Create React + TypeScript project
- [ ] Create project structure
- [ ] Implement Ingredient
- [ ] Implement Recipe
- [ ] Implement RecipeBuilder
- [ ] Implement RecipeScaler
- [ ] Create UI
- [ ] Connect UI with Core Logic
- [ ] Manual Testing
- [ ] Fix Bugs
- [ ] Final Documentation

## How to Run

หลังจากสร้าง React Project แล้ว ใช้คำสั่ง

```bash
npm install
npm run dev
```

จากนั้นเปิด URL ที่ Vite แสดงใน Terminal

## Project Scope

ฟีเจอร์หลักที่ต้องมี

- Create Recipe
- Add Ingredients
- Original Servings
- Target Servings
- Scale Ingredient Quantity
- Display Result
- Basic Validation
- OOP
- Builder Pattern

ฟีเจอร์ที่ยังไม่จำเป็น

- Login
- Register
- Database
- Backend API
- Payment
- AI
- Automated Testing

## Development Workflow

```text
Person 2
Create Repository
↓
Person 1
Setup Project + Core Logic
↓
Person 3
Create UI
↓
Connect UI + Core
↓
Person 2
Check Integration + Manual Test
↓
Fix Bugs
↓
Final Review
↓
Submit
```
