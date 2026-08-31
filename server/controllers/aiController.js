const ai = require("../config/gemini");
const Student = require("../models/Student");
const Company = require("../models/Company");
const extractPdfText = require("../utils/extractPdfText");

const testGemini = async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: "models/gemini-3.6-flash",
      contents: "Say Hello from Gemini in one sentence.",
    });

    return res.status(200).json({
      message: response.text,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

const placementMentor = async (req, res) => {
  try {
    const studentId = req.student.id;
    const companyId = req.params.companyId;

    const student = await Student.findById(studentId).select("-password");
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }
    if (!student.resume) {
      return res.status(400).json({
        message: "Please upload a resume first",
      });
    }


    const resumeText = await extractPdfText(student.resume);

    const prompt = `
You are an experienced Placement Mentor.

Analyze the student's profile, actual resume, and the company's requirements.

Student Details:
Name: ${student.name}
Branch: ${student.branch}
CGPA: ${student.cgpa}
Skills: ${student.skills.join(", ") || "Not Provided"}

Resume Content:
${resumeText}

Company Details:
Company: ${company.companyName}
Role: ${company.role}
Minimum CGPA: ${company.minimumCGPA}
Required Skills: ${company.skillsRequired.join(", ")}

Job Description:
${company.jobDescription}

Create a short learning roadmap based on the missing skills.
Put the most important skill first.
Keep it practical and suitable for a student preparing for this role.

Return ONLY a valid JSON object.

Do NOT write explanations before or after the JSON.
Do NOT use Markdown.
Do NOT use code fences.

Use exactly this structure:

{
  "skillMatchScore": 0,
  "projectMatchScore": 0,
  "jobMatchScore": 0,
  "strengths": [],
  "missingSkills": [],
  "recommendations": [],
  "learningRoadmap": [],
  "reason": ""
}

Scoring rules:
- skillMatchScore: 0 to 100 based on how many important required skills the student has.
- projectMatchScore: 0 to 100 based on how relevant the student's projects are to the role.
- jobMatchScore: 0 to 100 based on how closely the resume matches the job description.
- Do not invent skills, projects, or experience.
`;

    const response = await ai.models.generateContent({
      model: "models/gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const cleanResponse = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const aiResult = JSON.parse(cleanResponse);

    const profilePoints =
      (student.resume ? 5 : 0) +
      (student.skills?.length > 0 ? 3 : 0) +
      (student.github ? 1 : 0) +
      (student.linkedin ? 1 : 0);

    const profileScore = profilePoints * 10;

    const academicScore = student.cgpa >= company.minimumCGPA ? 100 : 0;

    const placementProbability = Math.round(
      academicScore * 0.2 +
        aiResult.skillMatchScore * 0.3 +
        aiResult.projectMatchScore * 0.25 +
        aiResult.jobMatchScore * 0.15 +
        profileScore * 0.1,
    );

    const branchEligible = company.eligibleBranches.includes(student.branch);

    const cgpaEligible = student.cgpa >= company.minimumCGPA;

    const shouldApply = branchEligible && cgpaEligible;

    return res.status(200).json({
      placementProbability,
      shouldApply,
      strengths: aiResult.strengths,
      missingSkills: aiResult.missingSkills,
      recommendations: aiResult.recommendations,
      learningRoadmap: aiResult.learningRoadmap,
      reason: aiResult.reason,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

const generalPlacementMentor = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const student = await Student.findById(req.student.id).select("-password");

    const prompt = `
You are an AI Placement Mentor for a college student.

The student's details are:
Name: ${student.name}
Branch: ${student.branch}
CGPA: ${student.cgpa}
Skills: ${student.skills?.join(", ") || "Not provided"}

Answer the student's question about placements, DSA, resumes, interviews,
career preparation, projects, or technical skills.

Student's question:
${message}

Give a helpful, practical, and easy-to-understand answer.

Formatting rules:
- Structure the answer clearly like a helpful ChatGPT response.
- Use short headings on separate lines when needed.
- Use numbered lists for steps and roadmaps.
- Put every list item on a new line.
- Add blank lines between important sections.
- Keep paragraphs short, maximum 3 to 5 sentences.
- Do NOT write the entire answer as one paragraph.
- Do NOT use Markdown symbols such as **, ###, *, or backticks.
- Use plain text with proper line breaks.
`;

    const response = await ai.models.generateContent({
      model: "models/gemini-3.6-flash",
      contents: prompt,
    });

    return res.status(200).json({
      reply: response.text,
    });
  } catch (error) {
    console.error("AI Mentor Error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  testGemini,
  placementMentor,
  generalPlacementMentor,
};
