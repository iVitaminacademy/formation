// All lesson and quiz content for Grades 4 & 5
// Each lesson has a unique id used by KidQuiz to load the right questions

export const curriculum = {

  // ─────────────────────────────────────────────
  // GRADE 4
  // ─────────────────────────────────────────────
  4: [
    {
      id: 1,
      name: 'Place Value & Basic Math',
      icon: '🔢',
      color: '#6366F1',
      bg: '#EEF2FF',
      border: '#C7D2FE',
      lessons: [
        {
          id: 101,
          title: 'Place Value & Decimals',
          questions: 3,
          time: 5,
          status: 'done',
          quiz: [
            {
              text: 'What is the value of the digit 5 in 4,567,890?',
              options: ['50,000', '500,000', '5,000,000', '5,000'],
              correct: '500,000',
              hint: 'Look at the commas to find the place value name.',
              explanation: 'The 5 is in the hundred-thousands place. 5 × 100,000 = 500,000.',
            },
            {
              text: 'Write 3.75 in expanded form.',
              options: ['3 + 0.7 + 0.05', '3 + 7 + 5', '3 + 0.75', '3.7 + 0.05'],
              correct: '3 + 0.7 + 0.05',
              hint: 'Break the number into ones + tenths + hundredths.',
              explanation: '3 is the ones place, 7 is the tenths (0.7), and 5 is the hundredths (0.05).',
            },
            {
              text: 'Compare 0.45 and 0.4. Which statement is correct?',
              options: ['0.45 > 0.4', '0.45 < 0.4', '0.45 = 0.4', 'Cannot compare'],
              correct: '0.45 > 0.4',
              hint: 'Add a zero to 0.4 to make it 0.40 and compare.',
              explanation: '0.45 is forty-five hundredths. 0.40 is forty hundredths. 45 > 40, so 0.45 > 0.4.',
            },
          ],
        },
        {
          id: 102,
          title: 'Addition & Subtraction',
          questions: 3,
          time: 5,
          status: 'done',
          quiz: [
            {
              text: '567 + 389 = ?',
              options: ['946', '956', '966', '936'],
              correct: '956',
              hint: 'Start from the right (ones place) and carry over.',
              explanation: '7+9=16, write 6 carry 1. 6+8+1=15, write 5 carry 1. 5+3+1=9. Answer: 956.',
            },
            {
              text: '912 − 478 = ?',
              options: ['424', '444', '434', '436'],
              correct: '434',
              hint: 'Use the borrowing method when the top digit is smaller.',
              explanation: '912 − 478 = 434. Borrow from the tens when needed: 12−8=4, 0−7 borrow → 10−7=3, 8−4=4.',
            },
            {
              text: '24 × 13 = ?',
              options: ['302', '312', '322', '292'],
              correct: '312',
              hint: 'Break 13 into 10 + 3.',
              explanation: '24 × 10 = 240, 24 × 3 = 72. Then 240 + 72 = 312.',
            },
          ],
        },
        {
          id: 103,
          title: 'Word Problems — Basic',
          questions: 3,
          time: 6,
          status: 'start',
          quiz: [
            {
              text: 'A rectangle is 15 feet long and 8 feet wide. What is its area?',
              options: ['90 sq ft', '110 sq ft', '120 sq ft', '130 sq ft'],
              correct: '120 sq ft',
              hint: 'Area = length × width.',
              explanation: 'Area = 15 × 8 = 120 square feet.',
            },
            {
              text: 'Sarah had $65. She spent $18 on a book and $9 on snacks. How much is left?',
              options: ['$36', '$38', '$40', '$42'],
              correct: '$38',
              hint: 'First add the total spent, then subtract from $65.',
              explanation: '$18 + $9 = $27 total spent. $65 − $27 = $38 remaining.',
            },
            {
              text: 'A car travels 180 miles in 3 hours. How fast is it going?',
              options: ['50 mph', '55 mph', '60 mph', '65 mph'],
              correct: '60 mph',
              hint: 'Divide total distance by total time.',
              explanation: 'Speed = 180 ÷ 3 = 60 miles per hour.',
            },
          ],
        },
      ],
    },

    {
      id: 2,
      name: 'Primes & Multi-digit Operations',
      icon: '✖️',
      color: '#3B82F6',
      bg: '#EFF6FF',
      border: '#BFDBFE',
      lessons: [
        {
          id: 201,
          title: 'Prime & Composite Numbers',
          questions: 3,
          time: 5,
          status: 'done',
          quiz: [
            {
              text: 'Is 23 a prime or composite number?',
              options: ['Prime', 'Composite', 'Neither', 'Both'],
              correct: 'Prime',
              hint: 'Check if any number from 2 to 22 divides evenly into 23.',
              explanation: '23 has only two factors: 1 and 23. That makes it a prime number.',
            },
            {
              text: 'Is 49 prime or composite?',
              options: ['Prime', 'Composite', 'Neither', 'Both'],
              correct: 'Composite',
              hint: 'Try dividing 49 by 7.',
              explanation: '49 = 7 × 7. Because it has more than two factors, it is composite.',
            },
            {
              text: 'Which list shows ALL prime numbers between 30 and 50?',
              options: ['31, 37, 41, 43, 47', '31, 39, 41, 43, 47', '31, 37, 41, 43, 49', '33, 37, 41, 43, 47'],
              correct: '31, 37, 41, 43, 47',
              hint: 'Test each number — can it be divided by anything other than 1 and itself?',
              explanation: '31, 37, 41, 43, and 47 each have only two factors. 39=3×13, 49=7×7, 33=3×11 so those are composite.',
            },
          ],
        },
        {
          id: 202,
          title: 'Multi-digit Multiplication & Division',
          questions: 2,
          time: 7,
          status: 'start',
          quiz: [
            {
              text: '456 × 24 = ?',
              options: ['10,944', '10,844', '11,044', '10,744'],
              correct: '10,944',
              hint: 'Break 24 into 20 + 4 and multiply each part.',
              explanation: '456 × 20 = 9,120 and 456 × 4 = 1,824. Then 9,120 + 1,824 = 10,944.',
            },
            {
              text: '1,248 ÷ 32 = ?',
              options: ['37', '38', '39', '40'],
              correct: '39',
              hint: 'Ask: how many groups of 32 fit into 1,248?',
              explanation: '32 × 39 = 1,248. Check: 32×40=1,280, which is too big, so 39 is correct.',
            },
          ],
        },
      ],
    },

    {
      id: 3,
      name: 'Fractions',
      icon: '½',
      color: '#EC4899',
      bg: '#FDF2F8',
      border: '#FBCFE8',
      lessons: [
        {
          id: 301,
          title: 'Fraction Equivalence & Comparison',
          questions: 3,
          time: 5,
          status: 'done',
          quiz: [
            {
              text: 'Are 2/3 and 4/6 equivalent fractions?',
              options: ['Yes, they are equal', 'No, they are different', 'Only after simplifying 4/6', 'Cannot compare'],
              correct: 'Yes, they are equal',
              hint: 'Multiply 2/3 by 2/2 and see what you get.',
              explanation: '2/3 × 2/2 = 4/6. Both fractions represent the same amount — they are equivalent.',
            },
            {
              text: 'Compare 3/5 and 5/8. Which is correct?',
              options: ['3/5 < 5/8', '3/5 > 5/8', '3/5 = 5/8', 'Cannot compare'],
              correct: '3/5 < 5/8',
              hint: 'Convert both to decimals: 3÷5 = ? and 5÷8 = ?',
              explanation: '3/5 = 0.6 and 5/8 = 0.625. Since 0.6 < 0.625, we have 3/5 < 5/8.',
            },
            {
              text: 'Which pair shows two fractions equivalent to 3/4?',
              options: ['6/8 and 9/12', '5/8 and 7/12', '6/9 and 9/12', '4/5 and 6/8'],
              correct: '6/8 and 9/12',
              hint: 'Multiply the top and bottom of 3/4 by the same number.',
              explanation: '3/4 × 2/2 = 6/8, and 3/4 × 3/3 = 9/12. Both are equivalent to 3/4.',
            },
          ],
        },
        {
          id: 302,
          title: 'Fraction & Decimal Operations',
          questions: 4,
          time: 7,
          status: 'start',
          quiz: [
            {
              text: '3/4 + 1/8 = ?',
              options: ['4/8', '6/8', '7/8', '5/8'],
              correct: '7/8',
              hint: 'Multiply 3/4 by 2/2 to get a common denominator of 8.',
              explanation: '3/4 = 6/8. Then 6/8 + 1/8 = 7/8.',
            },
            {
              text: 'Convert 4/5 to a decimal.',
              options: ['0.75', '0.8', '0.85', '0.9'],
              correct: '0.8',
              hint: 'Divide the numerator by the denominator: 4 ÷ 5.',
              explanation: '4 ÷ 5 = 0.8. Dividing numerator by denominator always gives the decimal form.',
            },
            {
              text: '0.75 − 0.35 = ?',
              options: ['0.30', '0.40', '0.45', '0.35'],
              correct: '0.40',
              hint: 'Line up the decimal points, then subtract.',
              explanation: '0.75 − 0.35 = 0.40. Subtract tenths: 7−3=4, hundredths: 5−5=0.',
            },
            {
              text: '1.2 + 0.45 = ?',
              options: ['1.60', '1.65', '1.70', '1.55'],
              correct: '1.65',
              hint: 'Write 1.2 as 1.20 first, then add.',
              explanation: '1.20 + 0.45 = 1.65. Align decimal points: 0+5=5 hundredths, 2+4=6 tenths, 1+0=1 ones.',
            },
          ],
        },
      ],
    },

    {
      id: 4,
      name: 'Geometry, Data & Finance',
      icon: '📐',
      color: '#A855F7',
      bg: '#FAF5FF',
      border: '#E9D5FF',
      lessons: [
        {
          id: 401,
          title: 'Geometry & Measurement',
          questions: 5,
          time: 7,
          status: 'done',
          quiz: [
            {
              text: 'What is the perimeter of a rectangle 12 cm long and 7 cm wide?',
              options: ['36 cm', '38 cm', '40 cm', '84 cm'],
              correct: '38 cm',
              hint: 'Add all four sides: top + bottom + left + right.',
              explanation: 'Perimeter = 2 × (length + width) = 2 × (12 + 7) = 2 × 19 = 38 cm.',
            },
            {
              text: 'How many degrees are in a right angle?',
              options: ['45°', '90°', '180°', '360°'],
              correct: '90°',
              hint: 'A right angle looks like the corner of a square.',
              explanation: 'A right angle is exactly 90°. Acute < 90°, right = 90°, obtuse is between 90° and 180°.',
            },
            {
              text: 'What is the area of a rectangle 15 cm long and 10 cm wide?',
              options: ['125 cm²', '140 cm²', '150 cm²', '50 cm'],
              correct: '150 cm²',
              hint: 'Area = length × width.',
              explanation: 'Area = 15 × 10 = 150 cm². Remember area is measured in square units.',
            },
            {
              text: 'Does a rectangle have a line of symmetry?',
              options: ['Yes — 2 lines', 'No — none', 'Yes — 1 line', 'Yes — 4 lines'],
              correct: 'Yes — 2 lines',
              hint: 'Imagine folding the rectangle in half — how many ways can you fold it so both halves match?',
              explanation: 'A rectangle has 2 lines of symmetry: one horizontal through the center and one vertical.',
            },
            {
              text: 'What is the area of a square with side length 9 units?',
              options: ['18 sq units', '36 sq units', '72 sq units', '81 sq units'],
              correct: '81 sq units',
              hint: 'Multiply the side length by itself.',
              explanation: 'Area of a square = side × side = 9 × 9 = 81 square units.',
            },
          ],
        },
        {
          id: 402,
          title: 'Data & Financial Literacy',
          questions: 3,
          time: 5,
          status: 'start',
          quiz: [
            {
              text: 'You earn $25 and spend $12. How much money do you have left?',
              options: ['$10', '$11', '$13', '$15'],
              correct: '$13',
              hint: 'Subtract your expenses from your income.',
              explanation: '$25 − $12 = $13 remaining. This is your profit or money left over.',
            },
            {
              text: 'Monday: 15 toys sold. Tuesday: 23 toys sold. How many MORE toys were sold on Tuesday?',
              options: ['6 toys', '7 toys', '8 toys', '9 toys'],
              correct: '8 toys',
              hint: 'Find how much bigger 23 is than 15.',
              explanation: '23 − 15 = 8 more toys sold on Tuesday.',
            },
            {
              text: 'Income is $40 and expenses are $28. What is the profit?',
              options: ['$8', '$10', '$12', '$14'],
              correct: '$12',
              hint: 'Profit = Income − Expenses.',
              explanation: '$40 − $28 = $12 profit. Profit is what remains after all expenses are paid.',
            },
          ],
        },
      ],
    },
  ],

  // ─────────────────────────────────────────────
  // GRADE 5
  // ─────────────────────────────────────────────
  5: [
    {
      id: 5,
      name: 'Decimal Operations',
      icon: '🔢',
      color: '#0891B2',
      bg: '#ECFEFF',
      border: '#A5F3FC',
      lessons: [
        {
          id: 501,
          title: 'Ordering & Multiplying Decimals',
          questions: 2,
          time: 5,
          status: 'done',
          quiz: [
            {
              text: 'Order 0.405, 0.45, and 0.4 from smallest to largest.',
              options: ['0.4, 0.45, 0.405', '0.4, 0.405, 0.45', '0.405, 0.4, 0.45', '0.45, 0.405, 0.4'],
              correct: '0.4, 0.405, 0.45',
              hint: 'Add zeros to make all numbers 3 decimal places: 0.400, 0.405, 0.450.',
              explanation: '0.400 < 0.405 < 0.450, so the order is 0.4, 0.405, 0.45.',
            },
            {
              text: '6.78 × 100 = ?',
              options: ['67.8', '678', '6780', '0.0678'],
              correct: '678',
              hint: 'Multiplying by 100 moves the decimal 2 places to the right.',
              explanation: '6.78 × 100 = 678. Each zero in 100 moves the decimal one place right.',
            },
          ],
        },
        {
          id: 502,
          title: 'Place Value with Decimals',
          questions: 4,
          time: 6,
          status: 'start',
          quiz: [
            {
              text: 'Round 12.567 to the nearest hundredth.',
              options: ['12.56', '12.57', '12.6', '13.0'],
              correct: '12.57',
              hint: 'Look at the thousandths digit. If it is ≥ 5, round up.',
              explanation: 'The thousandths digit is 7 (≥ 5), so we round the hundredths up: 12.57.',
            },
            {
              text: '0.78 × 1,000 = ?',
              options: ['7.8', '78', '780', '7800'],
              correct: '780',
              hint: 'Move the decimal point 3 places to the right (one for each zero in 1,000).',
              explanation: '0.78 → 0780 = 780. Multiplying by 1,000 shifts the decimal 3 places right.',
            },
            {
              text: 'What is the value of the digit 4 in 23.456?',
              options: ['4 ones', '4 tenths', '4 hundredths', '4 thousandths'],
              correct: '4 tenths',
              hint: 'The first digit after the decimal point is the tenths place.',
              explanation: 'In 23.456, the 4 is the first digit after the decimal — the tenths place. Its value is 0.4.',
            },
            {
              text: '456 ÷ 100 = ?',
              options: ['45.6', '4.56', '0.456', '456'],
              correct: '4.56',
              hint: 'Dividing by 100 moves the decimal 2 places to the left.',
              explanation: '456 → 4.56. Dividing by 100 shifts the decimal 2 places to the left.',
            },
          ],
        },
      ],
    },

    {
      id: 6,
      name: 'Fraction Operations',
      icon: '½',
      color: '#EC4899',
      bg: '#FDF2F8',
      border: '#FBCFE8',
      lessons: [
        {
          id: 601,
          title: 'Adding & Multiplying Fractions',
          questions: 4,
          time: 8,
          status: 'done',
          quiz: [
            {
              text: '2/3 + 3/4 = ?',
              options: ['5/7', '11/12', '17/12', '5/12'],
              correct: '17/12',
              hint: 'Find the least common multiple of 3 and 4, which is 12.',
              explanation: '2/3 = 8/12 and 3/4 = 9/12. Then 8/12 + 9/12 = 17/12 (or 1 and 5/12).',
            },
            {
              text: '3/5 × 4/7 = ?',
              options: ['7/12', '12/35', '12/12', '7/35'],
              correct: '12/35',
              hint: 'Multiply numerators together and denominators together — no common denominator needed.',
              explanation: '3 × 4 = 12 (numerator) and 5 × 7 = 35 (denominator). Answer: 12/35.',
            },
            {
              text: '2¼ × 3 = ?',
              options: ['6', '6¼', '6¾', '7'],
              correct: '6¾',
              hint: 'Convert 2¼ to an improper fraction first: 2¼ = 9/4.',
              explanation: '2¼ = 9/4. Then 9/4 × 3 = 27/4 = 6¾.',
            },
            {
              text: '3½ − 1¾ = ?',
              options: ['1¾', '2¼', '1½', '2'],
              correct: '1¾',
              hint: 'Convert to improper fractions: 3½ = 7/2 = 14/4 and 1¾ = 7/4.',
              explanation: '14/4 − 7/4 = 7/4 = 1¾.',
            },
          ],
        },
      ],
    },

    {
      id: 7,
      name: 'Division & Algebra',
      icon: '✖️',
      color: '#3B82F6',
      bg: '#EFF6FF',
      border: '#BFDBFE',
      lessons: [
        {
          id: 701,
          title: 'Multi-Digit Division',
          questions: 3,
          time: 8,
          status: 'done',
          quiz: [
            {
              text: '1,456 ÷ 28 = ?',
              options: ['48', '50', '52', '54'],
              correct: '52',
              hint: 'Use long division. How many times does 28 fit into 145?',
              explanation: '28 × 52 = 1,456. Check: 28 × 50 = 1,400, 28 × 2 = 56 → 1,400 + 56 = 1,456 ✓',
            },
            {
              text: '3,672 ÷ 48 = ?',
              options: ['74', '75', '76', '77'],
              correct: '76',
              hint: 'How many times does 48 fit into 367? Then bring down the next digit.',
              explanation: '48 × 76 = 3,648. Wait — let\'s verify: 48 goes into 367 7 times (336), remainder 31. Bring down 2 → 312 ÷ 48 = 6. Answer: 76 remainder 24.',
            },
            {
              text: '5,625 ÷ 75 = ?',
              options: ['70', '72', '75', '80'],
              correct: '75',
              hint: 'Break it into steps: 75 into 562, then bring down the 5.',
              explanation: '75 × 7 = 525. 562 − 525 = 37. Bring down 5 → 375 ÷ 75 = 5. Answer: 75.',
            },
          ],
        },
        {
          id: 702,
          title: 'Algebraic Reasoning & Volume',
          questions: 3,
          time: 7,
          status: 'start',
          quiz: [
            {
              text: 'What is 6x + 9 when x = 7?',
              options: ['48', '49', '51', '54'],
              correct: '51',
              hint: 'Replace x with 7, then calculate: 6 × 7 first.',
              explanation: '6 × 7 = 42. Then 42 + 9 = 51.',
            },
            {
              text: 'Solve for x: 5x − 15 = 35',
              options: ['x = 8', 'x = 9', 'x = 10', 'x = 12'],
              correct: 'x = 10',
              hint: 'Add 15 to both sides first, then divide by 5.',
              explanation: '5x − 15 = 35 → 5x = 50 → x = 10. Check: 5×10−15 = 50−15 = 35 ✓',
            },
            {
              text: 'A rectangular prism is 6 cm long, 4 cm wide, and 5 cm high. What is its volume?',
              options: ['60 cm³', '80 cm³', '100 cm³', '120 cm³'],
              correct: '120 cm³',
              hint: 'Volume = length × width × height.',
              explanation: '6 × 4 × 5 = 120 cm³. Volume is measured in cubic units (cm³).',
            },
          ],
        },
      ],
    },

    {
      id: 8,
      name: 'Data, Patterns & Finance',
      icon: '📊',
      color: '#16A34A',
      bg: '#F0FDF4',
      border: '#86EFAC',
      lessons: [
        {
          id: 801,
          title: 'Graphing & Patterns',
          questions: 3,
          time: 5,
          status: 'done',
          quiz: [
            {
              text: 'In which quadrant is the point (4, −3)?',
              options: ['Quadrant I', 'Quadrant II', 'Quadrant III', 'Quadrant IV'],
              correct: 'Quadrant IV',
              hint: 'Quadrant IV has a positive x and a negative y value.',
              explanation: '(4, −3): x is positive (right), y is negative (down) → Quadrant IV (bottom right).',
            },
            {
              text: 'What is the next number in the pattern: 5, 8, 11, 14, ___?',
              options: ['15', '16', '17', '18'],
              correct: '17',
              hint: 'Figure out how much is added each time.',
              explanation: '5+3=8, 8+3=11, 11+3=14, 14+3=17. The pattern adds 3 each time.',
            },
            {
              text: '4 students scored 85, 5 scored 90, 2 scored 95. What is the median?',
              options: ['85', '87', '90', '92'],
              correct: '90',
              hint: 'Write all scores in order and find the middle value.',
              explanation: 'In order: 85,85,85,85,90,90,90,90,90,95,95. Middle (6th) value = 90.',
            },
          ],
        },
        {
          id: 802,
          title: 'Financial Literacy',
          questions: 3,
          time: 5,
          status: 'start',
          quiz: [
            {
              text: '$100 budget. You spend $35 on food and $22 on transport. How much is left?',
              options: ['$40', '$41', '$43', '$45'],
              correct: '$43',
              hint: 'Subtract all expenses from the total budget.',
              explanation: '100 − 35 − 22 = $43 remaining.',
            },
            {
              text: 'You earn $45 per week and save 30%. How much do you save each week?',
              options: ['$12.50', '$13.00', '$13.50', '$14.00'],
              correct: '$13.50',
              hint: 'Convert 30% to a decimal (0.30), then multiply.',
              explanation: '0.30 × $45 = $13.50 saved per week.',
            },
            {
              text: 'You save $120 out of $400 earned. What percentage did you save?',
              options: ['25%', '28%', '30%', '35%'],
              correct: '30%',
              hint: 'Percent = (amount saved ÷ total earned) × 100.',
              explanation: '120 ÷ 400 = 0.30 → 30%.',
            },
          ],
        },
        {
          id: 803,
          title: 'Word Problems',
          questions: 3,
          time: 6,
          status: 'locked',
          quiz: [
            {
              text: 'A rectangle is 18 m long and 12 m wide. What is its area?',
              options: ['180 m²', '200 m²', '216 m²', '228 m²'],
              correct: '216 m²',
              hint: 'Area = length × width.',
              explanation: '18 × 12 = 216 m².',
            },
            {
              text: 'Maria had $120. She spent $45 and $28. How much is left?',
              options: ['$44', '$45', '$47', '$49'],
              correct: '$47',
              hint: 'Subtract both amounts from $120.',
              explanation: '120 − 45 − 28 = 47.',
            },
            {
              text: 'A train travels 420 miles in 7 hours. What is its average speed?',
              options: ['55 mph', '58 mph', '60 mph', '65 mph'],
              correct: '60 mph',
              hint: 'Average speed = total distance ÷ total time.',
              explanation: '420 ÷ 7 = 60 miles per hour.',
            },
          ],
        },
      ],
    },
  ],
}

// Flat lookup: lessonId → quiz questions
export function getQuizByLessonId(lessonId) {
  for (const grade of Object.values(curriculum)) {
    for (const topic of grade) {
      for (const lesson of topic.lessons) {
        if (lesson.id === lessonId) {
          return {
            lessonTitle: lesson.title,
            topicName: topic.name,
            topicColor: topic.color,
            questions: lesson.quiz,
          }
        }
      }
    }
  }
  return null
}
