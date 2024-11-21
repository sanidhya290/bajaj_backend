const express =require("express");
const app= express();
const multer = require("multer");
const cors =require("cors")
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(4000,()=>{
    console.log("running on port 4000");
})
const upload = multer({ storage: multer.memoryStorage() });

const filterData = (arr) => {
  const numbers = [];
  const alphabets = [];
  let highest_lowercase_alphabet = null;
  let isPrime = false;

  arr.forEach((element) => {
    if (!isNaN(element)) {
      const number = parseInt(element);
      numbers.push(number);
      if (checkPrime(number)) {
        isPrime = true;
      }
    } else if (typeof element === "string" && /^[A-Za-z]$/.test(element)) {
      alphabets.push(element);
      if (/[a-z]/.test(element)) {
        if (
          !highest_lowercase_alphabet ||
          element > highest_lowercase_alphabet
        ) {
          highest_lowercase_alphabet = element;
        }
      }
    }
  });

  return { numbers, alphabets, highest_lowercase_alphabet, isPrime };
};

const checkPrime = (number) => {
  if (number < 2) return false;
  for (let i = 2; i <= Math.sqrt(number); i++) {
    if (number % i === 0) {
      return false;
    }
  }
  return true;
};

app.post("/bfhl", upload.single("file"), async (req, res) => {
  try {
    const { arr, file_b64 } = req.body;

    if (!arr || arr.length === 0) {
      return res.status(400).json({
        is_success: false,
        message: "No array found",
      });
    }

    const { numbers, alphabets, highest_lowercase_alphabet, isPrime } =
      filterData(arr);

    let fileValid = false;
    let fileMimeType = null;
    let fileSizeKB = null;

    if (file_b64) {
      try {
        const buffer = Buffer.from(file_b64, "base64");
        fileValid = true;
        fileMimeType = "application/octet-stream"; 
        fileSizeKB = Math.ceil(buffer.length / 1024);
      } catch (err) {
        fileValid = false;
      }
    }

    // Response
    res.status(200).json({
      is_success: true,
      user_id: "jhony1212",
      email: "email@1234.coom",
      roll_number: "121212",
      numbers,
      alphabets,
      highest_lowercase_alphabet: highest_lowercase_alphabet
        ? [highest_lowercase_alphabet]
        : [],
      is_prime_found: isPrime,
      file_valid: fileValid,
      file_mime_type: fileMimeType,
      file_size_kb: fileSizeKB,
    });
  } catch (error) {
    return res.status(400).json({
      is_success: false,
      message: error.message,
    });
  }
});

app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});