export interface MediumQuestion {
  id: number;
  question: string;
  choices: string[];
  answer: string;
}

// ── 40 base questions ────────────────────────────────────────────────────────

const q1:  MediumQuestion = { id: 1,  question: 'What computer part is known as the brain of the computer?', choices: ['RAM', 'SSD', 'CPU', 'PSU'], answer: 'CPU' };
const q2:  MediumQuestion = { id: 2,  question: 'Who invented the World Wide Web?', choices: ['Bill Gates', 'Tim Berners-Lee', 'Steve Jobs', 'Alan Turing'], answer: 'Tim Berners-Lee' };
const q3:  MediumQuestion = { id: 3,  question: 'What does RAM stand for?', choices: ['Read Access Memory', 'Rapid Access Module', 'Random Access Memory', 'Randomized Active Memory'], answer: 'Random Access Memory' };
const q4:  MediumQuestion = { id: 4,  question: 'Which component stores data permanently?', choices: ['RAM', 'CPU', 'SSD', 'GPU'], answer: 'SSD' };
const q5:  MediumQuestion = { id: 5,  question: 'Which device is used to type text into a computer?', choices: ['Monitor', 'Keyboard', 'Speaker', 'Webcam'], answer: 'Keyboard' };
const q6:  MediumQuestion = { id: 6,  question: 'Which company created the Android operating system?', choices: ['Apple', 'Microsoft', 'Google', 'IBM'], answer: 'Google' };
const q7:  MediumQuestion = { id: 7,  question: 'What does GPU stand for?', choices: ['General Processing Unit', 'Graphics Processing Unit', 'Graphic Power Utility', 'Graphical Processor Unit'], answer: 'Graphics Processing Unit' };
const q8:  MediumQuestion = { id: 8,  question: 'Which component supplies electrical power to the computer?', choices: ['GPU', 'PSU', 'RAM', 'HDD'], answer: 'PSU' };
const q9:  MediumQuestion = { id: 9,  question: 'Which device displays visual output from the computer?', choices: ['RAM', 'Monitor', 'SSD', 'CPU'], answer: 'Monitor' };
const q10: MediumQuestion = { id: 10, question: 'Who is known as the father of the computer?', choices: ['Alan Turing', 'Charles Babbage', 'Bill Gates', 'Steve Jobs'], answer: 'Charles Babbage' };
const q11: MediumQuestion = { id: 11, question: 'Which company developed Windows?', choices: ['Apple', 'Microsoft', 'Intel', 'IBM'], answer: 'Microsoft' };
const q12: MediumQuestion = { id: 12, question: 'Which component is mainly responsible for gaming graphics?', choices: ['GPU', 'SSD', 'PSU', 'RAM'], answer: 'GPU' };
const q13: MediumQuestion = { id: 13, question: 'What year was Google founded?', choices: ['1995', '1998', '2001', '2004'], answer: '1998' };
const q14: MediumQuestion = { id: 14, question: 'Which storage device uses spinning disks?', choices: ['SSD', 'HDD', 'RAM', 'Flash Drive'], answer: 'HDD' };
const q15: MediumQuestion = { id: 15, question: 'Which component cools the processor?', choices: ['SSD', 'Heat Sink and Fan', 'RAM', 'PSU'], answer: 'Heat Sink and Fan' };
const q16: MediumQuestion = { id: 16, question: 'Which device prints documents onto paper?', choices: ['Monitor', 'Printer', 'Webcam', 'Microphone'], answer: 'Printer' };
const q17: MediumQuestion = { id: 17, question: 'Which part connects all components inside the computer?', choices: ['CPU', 'Motherboard', 'GPU', 'SSD'], answer: 'Motherboard' };
const q18: MediumQuestion = { id: 18, question: 'Which company manufactures Ryzen processors?', choices: ['Intel', 'ASUS', 'AMD', 'NVIDIA'], answer: 'AMD' };
const q19: MediumQuestion = { id: 19, question: 'What does SSD stand for?', choices: ['Solid State Drive', 'System Storage Disk', 'Solid Storage Device', 'Secure State Drive'], answer: 'Solid State Drive' };
const q20: MediumQuestion = { id: 20, question: 'Which device is used to move the cursor on screen?', choices: ['Keyboard', 'Mouse', 'Speaker', 'Scanner'], answer: 'Mouse' };
const q21: MediumQuestion = { id: 21, question: 'Which company created the Macintosh computer?', choices: ['Dell', 'Lenovo', 'Apple', 'Microsoft'], answer: 'Apple' };
const q22: MediumQuestion = { id: 22, question: 'What is the function of RAM?', choices: ['Permanent storage', 'Temporary memory', 'Internet connection', 'Power supply'], answer: 'Temporary memory' };
const q23: MediumQuestion = { id: 23, question: 'Which cable is commonly used for high-definition video?', choices: ['SATA', 'VGA', 'HDMI', 'PS/2'], answer: 'HDMI' };
const q24: MediumQuestion = { id: 24, question: 'What year was Facebook launched?', choices: ['2001', '2004', '2008', '2010'], answer: '2004' };
const q25: MediumQuestion = { id: 25, question: 'Which device captures video input?', choices: ['Webcam', 'Monitor', 'Printer', 'Projector'], answer: 'Webcam' };
const q26: MediumQuestion = { id: 26, question: 'What does CPU stand for?', choices: ['Central Processing Unit', 'Computer Processing Utility', 'Central Program Unit', 'Core Processing Utility'], answer: 'Central Processing Unit' };
const q27: MediumQuestion = { id: 27, question: 'Which component allows a computer to connect to Wi-Fi?', choices: ['Sound Card', 'Network Adapter', 'GPU', 'RAM'], answer: 'Network Adapter' };
const q28: MediumQuestion = { id: 28, question: 'Which software protects computers from viruses?', choices: ['Media Player', 'Antivirus', 'Spreadsheet', 'Browser'], answer: 'Antivirus' };
const q29: MediumQuestion = { id: 29, question: 'Which port is commonly used for USB flash drives?', choices: ['HDMI', 'Ethernet', 'USB Port', 'VGA'], answer: 'USB Port' };
const q30: MediumQuestion = { id: 30, question: 'Who co-founded Apple with Steve Jobs?', choices: ['Bill Gates', 'Steve Wozniak', 'Tim Cook', 'Larry Page'], answer: 'Steve Wozniak' };
const q31: MediumQuestion = { id: 31, question: 'Which device converts digital files into paper copies?', choices: ['Projector', 'Speaker', 'Printer', 'Router'], answer: 'Printer' };
const q32: MediumQuestion = { id: 32, question: 'Which company is known for GeForce graphics cards?', choices: ['AMD', 'ASUS', 'NVIDIA', 'Intel'], answer: 'NVIDIA' };
const q33: MediumQuestion = { id: 33, question: 'What does ROM stand for?', choices: ['Read Only Memory', 'Rapid Output Memory', 'Random Output Module', 'Read Open Memory'], answer: 'Read Only Memory' };
const q34: MediumQuestion = { id: 34, question: 'Which component is installed into a DIMM slot?', choices: ['GPU', 'CPU', 'RAM', 'SSD'], answer: 'RAM' };
const q35: MediumQuestion = { id: 35, question: 'What year was the first iPhone released?', choices: ['2005', '2007', '2009', '2010'], answer: '2007' };
const q36: MediumQuestion = { id: 36, question: 'Which device provides wireless internet in homes?', choices: ['Router', 'Webcam', 'Scanner', 'Monitor'], answer: 'Router' };
const q37: MediumQuestion = { id: 37, question: 'Which type of software is Windows 11?', choices: ['Antivirus', 'Operating System', 'Browser', 'Game Engine'], answer: 'Operating System' };
const q38: MediumQuestion = { id: 38, question: 'Which company developed the Linux operating system?', choices: ['Apple', 'Google', 'Microsoft', 'Linux community led by Linus Torvalds'], answer: 'Linux community led by Linus Torvalds' };
const q39: MediumQuestion = { id: 39, question: 'Which computer part is upgraded to improve multitasking?', choices: ['RAM', 'Mouse', 'Webcam', 'Speaker'], answer: 'RAM' };
const q40: MediumQuestion = { id: 40, question: 'Which component is used to hear sound from a computer?', choices: ['Webcam', 'Microphone', 'Speaker', 'Scanner'], answer: 'Speaker' };
const q41: MediumQuestion = { id: 41, question: 'What does DNS do when you visit a website?', choices: ['Matches a domain name to an IP address', 'Encrypts files on your computer', 'Connects a printer to paper', 'Measures internet speed'], answer: 'Matches a domain name to an IP address' };
const q42: MediumQuestion = { id: 42, question: 'What is a phishing message designed to do?', choices: ['Trick someone into revealing private information', 'Repair damaged computer files', 'Improve a Wi-Fi signal', 'Back up photos automatically'], answer: 'Trick someone into revealing private information' };
const q43: MediumQuestion = { id: 43, question: 'What is the usual purpose of a ZIP file?', choices: ['To compress and bundle files', 'To play a video', 'To display a website', 'To install a graphics card'], answer: 'To compress and bundle files' };
const q44: MediumQuestion = { id: 44, question: 'What does a compiler do?', choices: ['Translates program code into a form a computer can run', 'Connects a computer to a wireless network', 'Stores files in the cloud', 'Blocks unwanted emails'], answer: 'Translates program code into a form a computer can run' };
const q45: MediumQuestion = { id: 45, question: 'What is a database mainly used for?', choices: ['Organizing and finding collections of information', 'Drawing pictures with a mouse', 'Cooling a computer processor', 'Sending power to a monitor'], answer: 'Organizing and finding collections of information' };
const q46: MediumQuestion = { id: 46, question: 'Why might a website show a CAPTCHA?', choices: ['To check whether a visitor is human', 'To increase the screen resolution', 'To make a file smaller', 'To test the computer speakers'], answer: 'To check whether a visitor is human' };
const q47: MediumQuestion = { id: 47, question: 'What does HTTPS help protect when you use a website?', choices: ['Data sent between your browser and the website', 'Files stored only on a USB drive', 'The computer from power outages', 'The screen from scratches'], answer: 'Data sent between your browser and the website' };
const q48: MediumQuestion = { id: 48, question: 'What kind of content is a file ending in ".mp3" usually used for?', choices: ['Audio', 'Images', 'Spreadsheets', 'Presentations'], answer: 'Audio' };
const q49: MediumQuestion = { id: 49, question: 'What does DHCP commonly do on a network?', choices: ['Assigns IP addresses to devices automatically', 'Creates passwords for user accounts', 'Converts sound into images', 'Updates a computer screen'], answer: 'Assigns IP addresses to devices automatically' };
const q50: MediumQuestion = { id: 50, question: 'In programming, what is a "bug"?', choices: ['An error or flaw in a program', 'A tool for cleaning a keyboard', 'A type of computer cable', 'A saved copy of a file'], answer: 'An error or flaw in a program' };

// ── 4 sets of 30 from a 50-question bank ──────────────────────────────────────
// Set A: Q1–20 + Q41–50   |  Set B: Q11–40
// Set C: Q1–10 + Q21–40  |  Set D: Q1–10 + Q31–50

export const mediumSetA: MediumQuestion[] = [q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,q11,q12,q13,q14,q15,q16,q17,q18,q19,q20,q41,q42,q43,q44,q45,q46,q47,q48,q49,q50];
export const mediumSetB: MediumQuestion[] = [q11,q12,q13,q14,q15,q16,q17,q18,q19,q20,q21,q22,q23,q24,q25,q26,q27,q28,q29,q30,q31,q32,q33,q34,q35,q36,q37,q38,q39,q40];
export const mediumSetC: MediumQuestion[] = [q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,q21,q22,q23,q24,q25,q26,q27,q28,q29,q30,q31,q32,q33,q34,q35,q36,q37,q38,q39,q40];
export const mediumSetD: MediumQuestion[] = [q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,q31,q32,q33,q34,q35,q36,q37,q38,q39,q40,q41,q42,q43,q44,q45,q46,q47,q48,q49,q50];

export const mediumSets: Record<string, MediumQuestion[]> = {
  A: mediumSetA,
  B: mediumSetB,
  C: mediumSetC,
  D: mediumSetD,
};
