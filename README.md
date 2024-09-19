[![License](https://img.shields.io/badge/License-Apache2-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0) [![Community](https://img.shields.io/badge/Join-Community-blue)](https://developer.ibm.com/callforcode/solutions/projects/get-started/)

# MAKANA-RAINI_UoN

- [Project summary](#project-summary)
  - [The issue we are hoping to solve](#the-issue-we-are-hoping-to-solve)
  - [How our technology solution can help](#how-our-technology-solution-can-help)
  - [Our idea](#our-idea)
- [Technology implementation](#technology-implementation)
  - [IBM watsonx product(s) used](#ibm-ai-services-used)
  - [Other IBM technology used](#other-ibm-technology-used)
  - [Solution architecture](#solution-architecture)
- [Presentation materials](#presentation-materials)
  - [Solution demo video](#solution-demo-video)
  - [Project development roadmap](#project-development-roadmap)
- [Additional details](#additional-details)
  - [How to run the project](#how-to-run-the-project)
  - [Live demo](#live-demo)
- [About this template](#about-this-template)
  - [Contributing](#contributing)
  - [Versioning](#versioning)
  - [Authors](#authors)
  - [License](#license)
  - [Acknowledgments](#acknowledgments)


## Project summary

### The issue we are hoping to solve

Climate change in Eastern Africa is causing extreme weather variability, leading to unpredictable rainfall and extended droughts. Smallholder farmers, who depend heavily on predictable weather for their crops, struggle to adapt to these changes. This results in reduced crop yields, food insecurity, and economic vulnerability.

### How our technology solution can help

Our AI tool provides climate-resilient farming insights for Eastern African farmers.

### Our idea

The Climate-Resilient Agricultural Planning Tool is designed to support smallholder farmers in Eastern Africa by offering a predictive, AI-driven platform that combines weather data, soil health analysis, and climate models. The tool integrates data from IBM watsonx.ai, The Weather Company APIs, and other environmental intelligence sources to provide personalized, data-driven recommendations.

Farmers can receive insights on the best planting times, water management strategies, and optimal crop choices based on real-time and historical climate data. The tool analyzes localized weather patterns and soil conditions to offer tailored advice, helping farmers mitigate risks associated with climate variability. This increases the chances of successful harvests, ensuring food security and economic stability.

Our platform is an improvement over existing solutions by focusing on region-specific challenges in Eastern Africa and leveraging the power of AI for smarter agricultural planning. It empowers farmers to plan and adapt to climate change more effectively, promoting sustainability and resilience in agriculture.

## Technology implementation

### IBM watsonx product(s) used

**Featured watsonx products**

- [watsonx.ai](https://www.ibm.com/products/watsonx-ai) - We used watsonx.ai to develop predictive models that analyze weather patterns and soil conditions for Eastern African farms. The AI models recommend optimal planting times, crop choices, and irrigation strategies based on localized climate data. The tool also provides insights on pest risks and crop yield predictions, enhancing decision-making for smallholder farmers.

- [watsonx.governance](https://www.ibm.com/products/watsonx-governance) - We integrated watsonx.governance to ensure data privacy and compliance, particularly when handling sensitive environmental and user data. This ensures the tool adheres to regional and international data governance standards while maintaining transparency and accountability in AI model usage.

- [watsonx Assistant](https://cloud.ibm.com/catalog/services/watsonx-assistant) - watsonx Assistant serves as the interface through which farmers interact with the platform. Using natural language processing (NLP), it provides easy-to-understand recommendations and answers to user queries about optimal farming practices, weather forecasts, and other relevant agricultural insights.

### Other IBM technology used

**Additional IBM AI services (Remove any that you did not use)**

- [Watson Machine Learning](https://cloud.ibm.com/catalog/services/watson-machine-learning) - Watson Machine Learning was used to train and deploy machine learning models that predict crop yields and soil health. The trained models help farmers in Eastern Africa make informed decisions about crop rotation, soil management, and harvest times based on environmental data and historical records.

- [Watson Studio](https://cloud.ibm.com/catalog/services/watson-studio) - Watson Studio was used for collaborative development, data preprocessing, and model training. Our team utilized Watson Studio’s integrated development environment to analyze agricultural datasets and train our machine learning models in a scalable and efficient way.

- [Natural Language Understanding](https://cloud.ibm.com/catalog/services/natural-language-understanding) - Natural Language Understanding is embedded within watsonx Assistant to analyze user input in local languages and dialects, providing accurate responses about farming practices. It processes farmer inquiries and converts them into actionable insights, allowing seamless communication between the AI and farmers in rural areas.

- [Language Translator](https://cloud.ibm.com/catalog/services/language-translator) - Language Translator was implemented to enable multilingual support in our platform, making it accessible to a broader audience across Eastern Africa. This tool helps translate localized content and AI-generated insights into various regional languages such as Swahili, Amharic, and Somali, enhancing user engagement.

### Solution architecture

Diagram and step-by-step description of the flow of our solution:

**Climate-Resilient Agricultural Planning Tool Flow:**
1. Farmer Interaction with Platform:
The farmer accesses the platform through a mobile app or web portal. They provide input such as crop type, location, soil type, and any specific farming challenges they are facing.

2. Data Processing via IBM Watsonx AI Services:
The system uses watsonx.ai to analyze farmer inputs along with external data such as weather forecasts, satellite images, and historical agricultural data.

3. Model Predictions and Recommendations:

- Watson Machine Learning generates predictions on optimal planting times, crop yields, and soil health based on the input and data analysis.
- The system provides recommendations for crop selection, irrigation schedules, and soil enhancement techniques, ensuring climate resilience.
4. Watsonx Assistant for Farmer Queries:

- Farmers can ask questions using voice or text in their local language.
- Watsonx Assistant utilizes Natural Language Understanding to process these inquiries.
The system responds with specific agricultural advice based on the data-driven - recommendations, presented in the farmer’s preferred language using the Language Translator.
5. Governance and Compliance:
Watsonx.governance ensures data privacy, regulatory compliance, and auditability of the AI models and predictions, ensuring trustworthiness of the recommendations.

6. Multilingual Support and Accessibility:

Language Translator enables translation of both input and output, allowing farmers from different regions to interact with the system in Swahili, Amharic, Somali, and other regional languages.
Farmers receive the recommendations in their local language, making the platform user-friendly and accessible.
7. Data Storage and Monitoring:

- The platform stores all user data, environmental data, and model predictions securely in the cloud using IBM Object Storage, enabling easy access and future analysis.
- The system continuously monitors environmental changes and adapts predictions and recommendations based on updated data.

## Presentation materials

### Solution demo video

[![Watch the video](https://raw.githubusercontent.com/Liquid-Prep/Liquid-Prep/main/images/readme/IBM-interview-video-image.png)](https://youtu.be/vOgCOoy_Bx0)

### Project development roadmap

The project currently does the following things:

- *Feature 1*: Collects and processes farmer inputs (crop type, location, soil data).
- *Feature 2*: Provides climate-resilient farming recommendations using watsonx.ai and weather data.
- *Feature 3*: Supports farmer queries in local languages using Watsonx Assistant and Language Translator.

In the future, we plan to:

- *Add advanced soil health monitoring* using IoT sensors.
- *Expand language support* to additional regional languages in Eastern Africa.
- *Integrate real-time market price data* to offer crop profitability insights.
- *Enhance data governance features* with further capabilities from watsonx.governance to meet regional regulatory requirements.

See below for our proposed schedule on next steps after the Call for Code 2024 submission.



## Additional details


### How to run the project

To run the project locally for development and testing, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/makanaraini/Climate-Resilient-Agricultural-Planning-Tool---CFC-2024.git
   ```

2. **Navigate to the Project Directory:**
   ```bash
   cd Climate-Resilient-Agricultural-Planning-Tool---CFC-2024
   ```

3. **Install Dependencies:**
   Make sure you have Node.js and Python installed. Install necessary dependencies using:
   ```bash
   npm install
   pip install -r requirements.txt
   ```

4. **Set Up Environment Variables:**
   Create a `.env` file in the root directory and add the required environment variables (e.g., API keys, database URLs).

5. **Run the Application:**
   - For the backend:
     ```bash
     python app.py
     ```
   - For the frontend:
     ```bash
     npm start
     ```

6. **Access the Application:**
   Open your web browser and go to `http://localhost:3000` to view the application.

### Live demo

You can find a running version of the system to test at: [Live Demo](http://example.com)

For access details, visit our [description document](./docs/DESCRIPTION.md).

---

You can adjust these instructions based on your actual setup and deployment process.