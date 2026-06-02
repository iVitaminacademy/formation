// Local lesson content mapping for demo (grade → lessons)
const lessons = {
  // Grade 4
  101: {
    lessonTitle: 'Place Value & Decimals',
    topic: 'Place Value',
    topicColor: '#3B82F6',
    questions: [
      { id: 1, text: 'What is the value of the digit 5 in 4,567,890?', options: ['5', '500', '5,000', '500,000'], correct: '500,000', hint: 'Look at the commas to find the place value name.', explanation: 'The 5 is in the hundred-thousands place (5 × 100,000 = 500,000).' },
      { id: 2, text: 'Write 3.75 in expanded form.', options: ['3 + 0.7 + 0.05', '3 + 0.75', '3.7 + 0.05', '3 + 7 + 5'], correct: '3 + 0.7 + 0.05', hint: 'Break the number into ones + tenths + hundredths.', explanation: '3 is ones, 7 is tenths (0.7), 5 is hundredths (0.05).' },
      { id: 3, text: 'Compare 0.45 and 0.4 using >, <, or =.', options: ['0.45 > 0.4', '0.45 < 0.4', '0.45 = 0.4', '0.45 ≥ 0.4'], correct: '0.45 > 0.4', hint: 'Add a zero to 0.4 to make it 0.40 and compare.', explanation: '0.45 is forty-five hundredths which is greater than forty hundredths (0.40).' },
    ],
  },

  102: {
    lessonTitle: 'Basic Math — Operations',
    topic: 'Arithmetic',
    topicColor: '#F97316',
    questions: [
      { id: 1, text: '567 + 389 = ?', options: ['946', '956', '976', '966'], correct: '956', hint: 'Start from the right (ones place).', explanation: 'Add hundreds, tens, then ones: 567 + 389 = 956.' },
      { id: 2, text: '912 − 478 = ?', options: ['424', '434', '444', '414'], correct: '434', hint: 'Use borrowing when needed.', explanation: 'Subtract using borrowing: 912 − 478 = 434.' },
      { id: 3, text: '24 × 13 = ?', options: ['312', '302', '292', '322'], correct: '312', hint: 'Break 13 into 10 + 3.', explanation: '24×10=240, 24×3=72, total 312.' },
    ],
  },

  103: {
    lessonTitle: 'Prime and Composite',
    topic: 'Number Theory',
    topicColor: '#A855F7',
    questions: [
      { id: 1, text: 'Is 23 prime or composite?', options: ['Prime', 'Composite', 'Neither', 'Both'], correct: 'Prime', hint: 'Check divisibility from 2 up to √23.', explanation: '23 has only 1 and 23 as factors.' },
      { id: 2, text: 'Is 49 prime or composite?', options: ['Prime', 'Composite', 'Both', 'Neither'], correct: 'Composite', hint: 'Try dividing by 7.', explanation: '49 = 7 × 7 so it is composite.' },
      { id: 3, text: 'List a prime number between 30 and 50.', options: ['31', '32', '33', '34'], correct: '31', hint: 'Test divisibility by small primes.', explanation: '31 is a prime; others like 32 are even.' },
    ],
  },

  104: {
    lessonTitle: 'Multi-digit Multiplication & Division',
    topic: 'Multiply / Divide',
    topicColor: '#16A34A',
    questions: [
      { id: 1, text: '456 × 24 = ?', options: ['10,944', '11,024', '9,944', '10,444'], correct: '10,944', hint: 'Break 24 into 20 + 4.', explanation: '456×20=9,120 and 456×4=1,824; sum 10,944.' },
      { id: 2, text: '1,248 ÷ 32 = ?', options: ['39', '38', '40', '36'], correct: '39', hint: 'How many groups of 32 fit into 1,248?', explanation: '32×39=1,248.' },
    ],
  },

  105: {
    lessonTitle: 'Fractions — Equivalence & Comparison',
    topic: 'Fractions',
    topicColor: '#EC4899',
    questions: [
      { id: 1, text: 'Are 2/3 and 4/6 equivalent?', options: ['Yes', 'No', 'Sometimes', 'Only with decimals'], correct: 'Yes', hint: 'Simplify or cross-multiply.', explanation: '4/6 simplifies to 2/3.' },
      { id: 2, text: 'Compare 3/5 and 5/8 using >, <, or =.', options: ['3/5 < 5/8', '3/5 > 5/8', '3/5 = 5/8', 'Cannot compare'], correct: '3/5 < 5/8', hint: 'Convert to decimals or cross-multiply.', explanation: '3/5=0.6; 5/8=0.625 so 0.6 < 0.625.' },
    ],
  },

  106: {
    lessonTitle: 'Geometry & Measurement',
    topic: 'Geometry',
    topicColor: '#A855F7',
    questions: [
      { id: 1, text: 'Perimeter of rectangle 12cm by 7cm?', options: ['38 cm', '24 cm', '84 cm', '19 cm'], correct: '38 cm', hint: 'Perimeter = 2×(l+w).', explanation: '2×(12+7)=38 cm.' },
      { id: 2, text: 'Area of rectangle 15cm by 10cm?', options: ['150 cm²', '25 cm²', '1500 cm²', '100 cm²'], correct: '150 cm²', hint: 'Area = length × width.', explanation: '15×10=150.' },
    ],
  },

  107: {
    lessonTitle: 'Data & Financial Literacy',
    topic: 'Money & Data',
    topicColor: '#3B82F6',
    questions: [
      { id: 1, text: 'You earn $25 and spend $12. How much left?', options: ['$13', '$12', '$37', '$14'], correct: '$13', hint: 'Income minus expenses.', explanation: '25 − 12 = 13.' },
      { id: 2, text: 'Monday sold 15 toys, Tuesday 23. How many more?', options: ['8', '7', '9', '6'], correct: '8', hint: 'Subtract Monday from Tuesday.', explanation: '23 − 15 = 8.' },
    ],
  },

  108: {
    lessonTitle: 'Mathematical Word Problems',
    topic: 'Problem Solving',
    topicColor: '#F97316',
    questions: [
      { id: 1, text: 'Rectangle 15ft × 8ft area?', options: ['120', '23', '30', '100'], correct: '120', hint: 'Area = length × width.', explanation: '15×8=120.' },
      { id: 2, text: 'Car travels 180 miles in 3 hours. Speed?', options: ['60 mph', '55 mph', '50 mph', '90 mph'], correct: '60 mph', hint: 'Divide distance by time.', explanation: '180 ÷ 3 = 60.' },
    ],
  },

  // Grade 5 (examples)
  201: {
    lessonTitle: 'Decimals & Place Value (Grade 5)',
    topic: 'Decimals',
    topicColor: '#3B82F6',
    questions: [
      { id: 1, text: 'Order 0.405, 0.45, 0.4 from smallest to largest.', options: ['0.4, 0.405, 0.45', '0.405, 0.4, 0.45', '0.45, 0.405, 0.4', '0.4, 0.45, 0.405'], correct: '0.4, 0.405, 0.45', hint: 'Add zeros to compare decimals.', explanation: '0.400 < 0.405 < 0.450.' },
      { id: 2, text: '6.78 × 100 = ?', options: ['678', '67.8', '6,780', '6.78'], correct: '678', hint: 'Move decimal two places right.', explanation: 'Multiplying by 100 shifts decimal right twice.' },
    ],
  },

  202: {
    lessonTitle: 'Fraction Operations (Grade 5)',
    topic: 'Fractions',
    topicColor: '#EC4899',
    questions: [
      { id: 1, text: '2/3 + 3/4 = ?', options: ['17/12', '5/7', '1', '11/12'], correct: '17/12', hint: 'Common denominator 12.', explanation: '8/12 + 9/12 = 17/12 = 1 5/12.' },
      { id: 2, text: '3/5 × 4/7 = ?', options: ['12/35', '7/20', '3/35', '1'], correct: '12/35', hint: 'Multiply numerators and denominators.', explanation: '3×4 / 5×7 = 12/35.' },
    ],
  },
}

export default lessons
