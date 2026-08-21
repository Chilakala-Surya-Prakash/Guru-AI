import { TopicExplanation, GradeLevel } from "../types";

export const CURATED_LESSONS: Record<string, TopicExplanation> = {
  photosynthesis: {
    topic: "Photosynthesis",
    title: "How Plants Cook Food Using Sunlight",
    tagline: "Nature's solar-powered green kitchen",
    subject: "Biology / Natural Science",
    difficulty: "Simple",
    analogy: {
      title: "The Solar Sandwich Bakery",
      metaphor: "A solar-powered bakery making sugar cakes",
      story: "Imagine every plant leaf is a tiny solar-powered bakery. The chef (Chlorophyll) takes three ingredients: water from the soil tap, air (carbon dioxide) from the kitchen window, and sunshine as electricity for the oven. When baked together, out comes delicious glucose snacks for the plant to grow, and fresh oxygen is puffed out the chimney for us to breathe!",
      mapping: [
        { concept: "Sunlight", analogyItem: "Solar Oven Electricity", takeaway: "Provides the energy to power the chemical reaction" },
        { concept: "Water (H2O)", analogyItem: "Water Tap in Soil", takeaway: "Absorbed by roots and brought to the leaves" },
        { concept: "Carbon Dioxide (CO2)", analogyItem: "Air from the Window", takeaway: "Taken in through tiny leaf pores called stomata" },
        { concept: "Glucose (C6H12O6)", analogyItem: "Sugar Cakes / Food", takeaway: "Energy storage the plant uses to grow" },
        { concept: "Oxygen (O2)", analogyItem: "Clean Air Puff", takeaway: "Released into the air as a helpful byproduct" }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: "Collecting the Raw Ingredients",
        content: "The plant gathers sunlight through green chlorophyll pigments in its leaves, pulls water up from the roots, and breathes in carbon dioxide gas through microscopic leaf pores called stomata.",
        example: "Just like filling your grocery cart before cooking dinner!",
        whiteboardDraw: {
          type: "diagram",
          title: "Phase 1: Gathering Ingredients",
          nodes: [
            { id: "sun", label: "Sunlight (Energy)", subtext: "Captured by Chlorophyll", iconType: "sun", highlight: true },
            { id: "water", label: "Water (H2O)", subtext: "Drawn from Roots", iconType: "droplets" },
            { id: "co2", label: "Carbon Dioxide", subtext: "Through Stomata Pores", iconType: "wind" }
          ],
          connections: [
            { from: "sun", to: "chloroplast", label: "Energy" },
            { from: "water", to: "chloroplast", label: "Liquid" },
            { from: "co2", to: "chloroplast", label: "Gas" }
          ],
          codeOrFormula: "6 CO₂ + 6 H₂O + Light Energy"
        },
        keyTakeaway: "Leaves act like solar collectors capturing light, water, and air."
      },
      {
        stepNumber: 2,
        title: "The Light-Dependent Reaction (Splitting Water)",
        content: "Inside tiny cell kitchens called Chloroplasts, sunlight strikes water molecules and splits them into hydrogen and oxygen. The oxygen isn't needed right now, so the leaf releases it into the air!",
        example: "Like cracking an egg: the plant keeps the good part and discards the shell (oxygen).",
        whiteboardDraw: {
          type: "flow",
          title: "Phase 2: Light Reaction in Thylakoids",
          nodes: [
            { id: "light", label: "Photon Strike", subtext: "Light strikes H2O", iconType: "zap" },
            { id: "split", label: "Water Splits", subtext: "H2O -> H+ & O2", highlight: true },
            { id: "o2_out", label: "O2 Released", subtext: "Oxygen we breathe!", iconType: "sparkles" }
          ],
          connections: [
            { from: "light", to: "split", label: "Energy" },
            { from: "split", to: "o2_out", label: "Byproduct" }
          ],
          codeOrFormula: "2 H₂O + Light → 4 H⁺ + 4 e⁻ + O₂ ↑"
        },
        keyTakeaway: "Sunlight breaks water apart, creating energy carriers (ATP/NADPH) and releasing fresh oxygen."
      },
      {
        stepNumber: 3,
        title: "The Calvin Cycle (Cooking the Sugar)",
        content: "Even without direct light, the plant mixes the stored hydrogen energy with carbon dioxide gas to construct glucose — a rich, sweet sugar molecule that builds plant stems, flowers, and fruits.",
        example: "Like mixing flour, eggs, and sugar in a bowl to bake a solid loaf of bread.",
        whiteboardDraw: {
          type: "cycle",
          title: "Phase 3: The Calvin Cycle (Sugar Synthesis)",
          nodes: [
            { id: "co2_fix", label: "Carbon Fixation", subtext: "CO2 binds with RuBP", iconType: "combine" },
            { id: "reduction", label: "Energy Infusion", subtext: "ATP & NADPH rebuild atoms", highlight: true },
            { id: "glucose", label: "Glucose Built (C6H12O6)", subtext: "Sweet plant fuel!", iconType: "box" }
          ],
          connections: [
            { from: "co2_fix", to: "reduction", label: "Enzyme RuBisCO" },
            { from: "reduction", to: "glucose", label: "Forms Sugar" }
          ],
          codeOrFormula: "Light Energy + 6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂"
        },
        keyTakeaway: "Carbon atoms are woven into glucose chains, providing stored energy for the food chain."
      }
    ],
    whiteboardSummary: {
      chalkboardTitle: "Summary: Photosynthesis Formula",
      corePrinciples: [
        "Reactants: Sunlight + 6 Carbon Dioxide + 6 Water molecules",
        "Products: 1 Glucose Sugar molecule + 6 Oxygen gas molecules",
        "Location: Inside leaf cells, specifically the green Chloroplasts"
      ],
      commonPitfalls: [
        "Plants do NOT only do photosynthesis: they also breathe oxygen at night (cellular respiration)!",
        "Oxygen comes from splitting water (H2O), not from carbon dioxide (CO2)."
      ],
      goldenRule: "Plants eat sunlight to make the food and air that all living things rely on."
    },
    speechScripts: {
      welcome: "Greetings, young scientist! Guru here. Let us unlock the wonder of Photosynthesis — how green plants create their own food directly from sunlight!",
      analogy: "Think of a plant leaf as a cozy solar bakery. Chlorophyll is the head chef using sunshine electricity to mix water and air into sweet sugar treats!",
      steps: [
        "In step one, the leaf gathers raw ingredients: sunlight, water from its roots, and carbon dioxide from the air.",
        "In step two, the power of sunlight splits water molecules, producing fresh oxygen for us to breathe!",
        "In step three, the Calvin cycle weaves carbon atoms into rich glucose sugar that lets the plant grow big and strong."
      ],
      wrapup: "And that is photosynthesis! The miracle engine that powers Earth's oxygen and food chains. Try the quick quiz below to test your understanding!"
    },
    quiz: [
      {
        question: "Where does the oxygen released by plants during photosynthesis originally come from?",
        options: ["From splitting water (H2O) molecules", "From carbon dioxide (CO2) in the air", "From soil minerals", "From sunlight beams"],
        correctAnswer: 0,
        explanation: "During the light reaction, sunlight splits water (H2O) into hydrogen ions and oxygen gas (O2)!",
        hint: "Think about the molecule with hydrogen and oxygen bonded together."
      },
      {
        question: "What is the green pigment inside plant cells that traps sunlight?",
        options: ["Chloroplast", "Chlorophyll", "Cytoplasm", "Cellulose"],
        correctAnswer: 1,
        explanation: "Chlorophyll is the special green pigment that absorbs light energy inside the chloroplasts.",
        hint: "Starts with Chloro- and ends with -phyll."
      },
      {
        question: "What is the main sugar product created by plants for food and energy?",
        options: ["Fructose syrup", "Glucose (C6H12O6)", "Lactose", "Table salt"],
        correctAnswer: 1,
        explanation: "Glucose is the simple sugar that stores energy for plant growth.",
        hint: "The formula has 6 Carbons, 12 Hydrogens, and 6 Oxygens."
      }
    ],
    deepDivePrompts: [
      "Why do leaves turn red and yellow in autumn?",
      "Can plants perform photosynthesis under artificial LED lights?",
      "How do desert cacti survive photosynthesis without losing all their water?"
    ]
  },
  blackholes: {
    topic: "Black Holes",
    title: "Cosmic Drainpipes of Space and Time",
    tagline: "Where gravity is so strong that not even light can escape",
    subject: "Astrophysics & Space Science",
    difficulty: "Medium",
    analogy: {
      title: "The Ultimate Cosmic Waterfall",
      metaphor: "A raging waterfall where the river of spacetime flows faster than the fastest speed boat",
      story: "Imagine space as a smooth flowing river, and light as a speedy motorboat. A black hole is a colossal waterfall in the river. Upstream, the boat can turn around easily. But once the boat passes the 'Point of No Return' (the Event Horizon), the river flows faster than the boat's top engine speed. It is pulled over the edge forever!",
      mapping: [
        { concept: "Event Horizon", analogyItem: "The Edge of the Waterfall", takeaway: "The boundary beyond which nothing can ever swim back" },
        { concept: "Singularity", analogyItem: "The Deep Plunge Basin", takeaway: "An infinitely dense point where all mass is crushed" },
        { concept: "Accretion Disk", analogyItem: "Swirling Foam at the Brink", takeaway: "Superheated gas glowing brightly before falling in" },
        { concept: "Spaghettification", analogyItem: "Stretching Taffy in Current", takeaway: "Extreme tidal gravitational pull stretching matter vertically" }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: "Birth of a Black Hole (Supernova Collapse)",
        content: "When a massive star runs out of nuclear fuel, its inward gravity overpowers outward radiation pressure. The entire star implodes in a fraction of a second!",
        example: "Like popping a giant balloon, but all the material collapses inward to a single dot.",
        whiteboardDraw: {
          type: "diagram",
          title: "Phase 1: Stellar Collapse",
          nodes: [
            { id: "star", label: "Dying Giant Star", subtext: "Fuel Exhausted", iconType: "sun" },
            { id: "implode", label: "Gravitational Collapse", subtext: "Mass Crushed Inward", iconType: "zap", highlight: true },
            { id: "supernova", label: "Supernova Explosion", subtext: "Outer Layers Blown Away", iconType: "sparkles" }
          ],
          connections: [
            { from: "star", to: "implode", label: "Gravity wins" },
            { from: "implode", to: "supernova", label: "Core forms Black Hole" }
          ],
          codeOrFormula: "Gravity > Radiation Pressure"
        },
        keyTakeaway: "Giant stars collapse under their own gravity when their fuel runs out."
      },
      {
        stepNumber: 2,
        title: "The Event Horizon & Accretion Disk",
        content: "The Event Horizon is the invisible boundary where escape velocity equals the speed of light. Around it, swirling matter rubs together at relativistic speeds, heating up to millions of degrees and emitting brilliant X-rays.",
        example: "Like water swirling around a bathtub drain before disappearing down the pipe.",
        whiteboardDraw: {
          type: "flow",
          title: "Phase 2: Anatomy of a Black Hole",
          nodes: [
            { id: "accretion", label: "Accretion Disk", subtext: "Glowing hot gas", iconType: "sun", highlight: true },
            { id: "horizon", label: "Event Horizon", subtext: "Escape Velocity = c", iconType: "globe" },
            { id: "singularity", label: "Singularity", subtext: "Infinite density point", iconType: "box" }
          ],
          connections: [
            { from: "accretion", to: "horizon", label: "Matter spirals in" },
            { from: "horizon", to: "singularity", label: "Crushed to center" }
          ],
          codeOrFormula: "Schwarzschild Radius: R = 2GM / c²"
        },
        keyTakeaway: "The event horizon marks the absolute point of no return."
      },
      {
        stepNumber: 3,
        title: "Time Dilation & Spaghettification",
        content: "Einstein showed that extreme gravity bends space and slows down time. To an outside observer, an object falling into a black hole appears to slow down and freeze at the horizon, while experiencing tidal forces stretching it like spaghetti!",
        example: "Like watching a slow-motion replay that pauses right at the edge of the frame.",
        whiteboardDraw: {
          type: "comparison",
          title: "Phase 3: Relativity Effects",
          nodes: [
            { id: "time", label: "Time Dilation", subtext: "Clocks tick slower near horizon", iconType: "zap" },
            { id: "gravity", label: "Tidal Gravitational Pull", subtext: "Feet pulled harder than head", highlight: true },
            { id: "spaghetti", label: "Spaghettification", subtext: "Matter stretched vertically", iconType: "arrow" }
          ],
          connections: [
            { from: "gravity", to: "spaghetti", label: "Differential pull" }
          ],
          codeOrFormula: "Δt' = Δt / √(1 - 2GM / rc²)"
        },
        keyTakeaway: "Gravity is not just a pull — it warps the fabric of time and geometry itself."
      }
    ],
    whiteboardSummary: {
      chalkboardTitle: "Black Holes: Essential Physics",
      corePrinciples: [
        "Formed from collapsed massive stars (>20x Sun's mass)",
        "Escape velocity exceeds the cosmic speed limit of light (300,000 km/s)",
        "Black holes do not act like cosmic vacuums at a distance: orbits stay stable unless you cross the horizon!"
      ],
      commonPitfalls: [
        "Black holes do NOT suck everything in the universe: if our Sun became a black hole with same mass, Earth would orbit normally!",
        "You cannot see a black hole directly; you see the glowing matter swirling around it."
      ],
      goldenRule: "Gravity concentrated into a small enough point bends spacetime until escape is impossible."
    },
    speechScripts: {
      welcome: "Step into the cosmos! Guru here to guide you through Black Holes — the most fascinating gravitational titans in the universe.",
      analogy: "Picture spacetime as a flowing river and light as the fastest boat. A black hole is the waterfall where the river flows faster than light itself!",
      steps: [
        "First, a giant star runs out of fuel and collapses under its own immense gravity.",
        "Second, an Event Horizon forms — the cosmic boundary where light cannot escape.",
        "Third, time slows down and matter is stretched by extreme tidal gravity."
      ],
      wrapup: "Now you understand the secrets of black holes! Try the interactive quiz to test your cosmic knowledge."
    },
    quiz: [
      {
        question: "What is the boundary of a black hole called, beyond which nothing can escape?",
        options: ["The Event Horizon", "The Asteroid Belt", "The Solar Flare", "The Nebula Rim"],
        correctAnswer: 0,
        explanation: "The Event Horizon is the threshold where gravity is so strong that escape velocity exceeds the speed of light.",
        hint: "It contains the word 'Horizon'."
      },
      {
        question: "What happens to time as you get closer to a black hole's event horizon relative to a distant observer?",
        options: ["Time appears to tick slower (Time Dilation)", "Time speeds up dramatically", "Time flows backward", "Time stops everywhere in the galaxy"],
        correctAnswer: 0,
        explanation: "General Relativity proves that strong gravitational fields slow down the passage of time (Gravitational Time Dilation).",
        hint: "Think about Einstein's relativity."
      },
      {
        question: "What would happen to Earth's orbit if the Sun were magically replaced by a black hole of the exact same mass?",
        options: ["Earth would continue orbiting normally at the same distance", "Earth would be sucked in within 8 minutes", "Earth would fly out of the solar system", "Earth would instantly disintegrate"],
        correctAnswer: 0,
        explanation: "Because gravity depends on mass and distance, a 1-solar-mass black hole has the exact same gravitational pull at 1 AU as our Sun!",
        hint: "Remember that gravity depends on total mass and distance."
      }
    ],
    deepDivePrompts: [
      "What is Hawking Radiation and do black holes eventually evaporate?",
      "What happens inside the singularity where our laws of physics break down?",
      "How do supermassive black holes at the center of galaxies form?"
    ]
  },
  machinelearning: {
    topic: "Machine Learning",
    title: "How Computers Learn from Experience",
    tagline: "Teaching algorithms with examples instead of hardcoded rules",
    subject: "Computer Science & AI",
    difficulty: "Simple",
    analogy: {
      title: "The Recipe Taste-Tester",
      metaphor: "A rookie chef learning to bake the perfect cookie through trial, feedback, and small adjustments",
      story: "Imagine teaching a friend to bake cookies without giving them a fixed recipe. They bake batch #1 with 2 cups of sugar. You taste it and say: 'Too sweet! Reduce sugar by half a cup.' They bake batch #2, taste it again, and adjust the oven temperature. After 500 batches, they know the exact formula for delicious cookies by learning from feedback!",
      mapping: [
        { concept: "Training Data", analogyItem: "Tasting Past Batches", takeaway: "Examples fed to the computer to learn patterns" },
        { concept: "Model Weights / Parameters", analogyItem: "Ingredient Measurements", takeaway: "Numbers the algorithm tweaks to get better results" },
        { concept: "Loss Function / Error", analogyItem: "How Far Off the Taste Is", takeaway: "Mathematical measure of how incorrect the prediction was" },
        { concept: "Optimization (Gradient Descent)", analogyItem: "Taking Steps Toward Better Flavor", takeaway: "Method for iteratively updating parameters to minimize error" }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: "Collecting & Feeding Training Data",
        content: "Traditional programming requires humans to write strict IF/THEN rules. In machine learning, we feed thousands of labeled examples (e.g. photos of cats and dogs) and let the computer discover the visual patterns.",
        example: "Showing a child 100 picture books of animals until they recognize a puppy automatically.",
        whiteboardDraw: {
          type: "diagram",
          title: "Step 1: Input Data & Features",
          nodes: [
            { id: "data", label: "Labeled Dataset", subtext: "10,000 Cat & Dog Photos", iconType: "database", highlight: true },
            { id: "features", label: "Feature Extraction", subtext: "Whiskers, Ears, Fur edges", iconType: "zap" },
            { id: "model", label: "Neural Network", subtext: "Initial random guess", iconType: "cpu" }
          ],
          connections: [
            { from: "data", to: "features", label: "Extracts" },
            { from: "features", to: "model", label: "Input signals" }
          ],
          codeOrFormula: "Input X → Model(W, b) → Prediction Ŷ"
        },
        keyTakeaway: "Machine learning finds patterns directly in data instead of manual code rules."
      },
      {
        stepNumber: 2,
        title: "Measuring Error (The Loss Function)",
        content: "When the model guesses wrong (calling a cat a dog), the loss function calculates how large the mistake was. This error signal is the compass that guides improvement.",
        example: "Like an archery target: measuring how many inches your arrow landed from the bullseye.",
        whiteboardDraw: {
          type: "flow",
          title: "Step 2: Error Calculation",
          nodes: [
            { id: "pred", label: "Model Guess: 'Dog' (70%)", subtext: "Prediction Output", iconType: "box" },
            { id: "truth", label: "True Label: 'Cat'", subtext: "Ground Truth", iconType: "check" },
            { id: "loss", label: "Loss Calculation", subtext: "High Penalty Error", iconType: "zap", highlight: true }
          ],
          connections: [
            { from: "pred", to: "loss", label: "Compare" },
            { from: "truth", to: "loss", label: "Evaluate" }
          ],
          codeOrFormula: "Loss = - Σ y·log(p) [Cross-Entropy]"
        },
        keyTakeaway: "Loss tells the algorithm exactly how far off its guess was."
      },
      {
        stepNumber: 3,
        title: "Backpropagation & Gradient Descent",
        content: "The algorithm traces backward through its internal dials (weights) and nudges each one slightly in the direction that reduces the error. Repeat this millions of times, and the system becomes remarkably accurate!",
        example: "Walking down a foggy hill by feeling which direction slopes downward with your feet.",
        whiteboardDraw: {
          type: "cycle",
          title: "Step 3: Optimization Loop",
          nodes: [
            { id: "grad", label: "Compute Gradient", subtext: "Direction of steepest error slope", iconType: "arrow" },
            { id: "update", label: "Update Weights", subtext: "W_new = W_old - α·∇L", iconType: "cpu", highlight: true },
            { id: "eval", label: "Better Accuracy!", subtext: "Lower error on next pass", iconType: "sparkles" }
          ],
          connections: [
            { from: "grad", to: "update", label: "Step down slope" },
            { from: "update", to: "eval", label: "Tuned model" }
          ],
          codeOrFormula: "W := W - η · (∂Loss / ∂W)"
        },
        keyTakeaway: "Gradient descent continuously turns the dials until errors reach their lowest point."
      }
    ],
    whiteboardSummary: {
      chalkboardTitle: "Machine Learning: Core Principles",
      corePrinciples: [
        "Data + Feedback > Explicit Rules",
        "Loss functions measure mistakes; Gradient Descent corrects them",
        "Generalization is the goal: performing well on brand new unseen data"
      ],
      commonPitfalls: [
        "Overfitting: Memorizing training data like cramming for an exam without truly understanding concepts",
        "Garbage in, garbage out: Biased or noisy data produces flawed predictions"
      ],
      goldenRule: "Machine learning is iterative optimization: make a guess, measure error, tweak dials, and repeat!"
    },
    speechScripts: {
      welcome: "Hello future technologist! Guru is here to demystify Machine Learning — how code learns from experience!",
      analogy: "Think of machine learning like a chef perfecting a secret sauce: tasting each batch, adjusting the spices, and getting closer to perfection with every try.",
      steps: [
        "Step one is gathering data examples for the computer to examine.",
        "Step two is calculating the mistake using a loss function.",
        "Step three is adjusting the internal weight dials using gradient descent."
      ],
      wrapup: "Now you know the secret behind AI models and recommendation engines! Try the quiz below."
    },
    quiz: [
      {
        question: "What is the primary difference between traditional programming and machine learning?",
        options: [
          "In ML, the computer learns rules from data instead of humans hardcoding every rule",
          "ML uses hardware that doesn't need electricity",
          "Traditional programming only works on mobile phones",
          "ML never makes mistakes"
        ],
        correctAnswer: 0,
        explanation: "Machine learning algorithms extract statistical patterns directly from labeled data rather than following rigid handwritten rules.",
        hint: "Focus on where the rules come from."
      },
      {
        question: "What role does 'Gradient Descent' play in training an AI model?",
        options: [
          "It iteratively updates model weights to minimize the prediction error",
          "It deletes all data from the hard drive",
          "It translates English into Spanish",
          "It speeds up monitor refresh rate"
        ],
        correctAnswer: 0,
        explanation: "Gradient descent calculates the slope of the error and takes steps downhill to find the optimal model weights.",
        hint: "Think about walking downhill to find the lowest valley."
      },
      {
        question: "What is 'Overfitting' in machine learning?",
        options: [
          "When a model memorizes training data so closely that it fails on new real-world data",
          "When the computer runs out of RAM",
          "When the AI generates too many images",
          "When data is stored in the cloud"
        ],
        correctAnswer: 0,
        explanation: "Overfitting happens when a model learns noise and specific quirks of training data instead of general patterns.",
        hint: "Like memorizing exact answers rather than understanding the concept."
      }
    ],
    deepDivePrompts: [
      "What is the difference between Supervised, Unsupervised, and Reinforcement Learning?",
      "How do Transformers and Attention mechanisms power Large Language Models?",
      "What ethical safeguards prevent AI bias in real-world applications?"
    ]
  }
};

// Intelligent generator for any arbitrary custom topic
export function generateClientLessonFallback(topic: string, level: GradeLevel = "Middle School"): TopicExplanation {
  const cleanTopic = topic.trim();
  const normalizedKey = cleanTopic.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Check if we have an exact curated match
  for (const [key, lesson] of Object.entries(CURATED_LESSONS)) {
    if (normalizedKey.includes(key) || key.includes(normalizedKey)) {
      return {
        ...lesson,
        topic: cleanTopic,
      };
    }
  }

  // Dynamic pedagogical generator tailored to the grade level
  const title = `How ${cleanTopic} Works: The Intuitive Visual Guide`;
  const tagline = `Unlocking ${cleanTopic} through simple mental models and clear visual steps`;

  return {
    topic: cleanTopic,
    title,
    tagline,
    subject: "Science & Knowledge",
    difficulty: level === "Elementary" ? "Simple" : level === "College" ? "Advanced" : "Medium",
    analogy: {
      title: `The Collaborative Workshop Model`,
      metaphor: `An organized workshop where specialized stations work together in sequence`,
      story: `Think of ${cleanTopic} as an artisan workshop team. Instead of one giant mystery, the process is split into clear jobs: one station gathers the raw supplies, the center workshop transforms them with energy, and the distribution station delivers the finished result. When each piece does its job smoothly, the entire system succeeds!`,
      mapping: [
        {
          concept: "Input / Starting State",
          analogyItem: "Workshop Supply Bin",
          takeaway: "The initial conditions and materials entering the system"
        },
        {
          concept: "Core Transformation",
          analogyItem: "The Master Artisan's Tools",
          takeaway: "The primary chemical, physical, or logical rule in action"
        },
        {
          concept: "Output / Observable Result",
          analogyItem: "Finished Product on Display",
          takeaway: "The final outcome created by the interaction"
        },
        {
          concept: "Control Mechanism",
          analogyItem: "Workshop Quality Guide",
          takeaway: "The laws or balance points keeping everything stable"
        }
      ]
    },
    steps: [
      {
        stepNumber: 1,
        title: "The Foundational Setup & Ingredients",
        content: `Every principle in ${cleanTopic} begins with simple foundational building blocks. Before any complex action takes place, the system gathers its necessary resources and sets the stage under consistent rules.`,
        example: `Like laying out all ingredients on the kitchen counter before turning on the oven.`,
        whiteboardDraw: {
          type: "diagram",
          title: "Phase 1: Initial Setup",
          nodes: [
            { id: "input_a", label: "Core Input", subtext: "Starting Condition", iconType: "box", highlight: true },
            { id: "force", label: "Driving Force", subtext: "Energy / Catalyst", iconType: "zap" },
            { id: "medium", label: "Active Environment", subtext: "System Arena", iconType: "globe" }
          ],
          connections: [
            { from: "input_a", to: "force", label: "Energizes" },
            { from: "force", to: "medium", label: "Acts within" }
          ],
          codeOrFormula: "Initial State + Energy → Transition"
        },
        keyTakeaway: "All complex phenomena start with identifiable inputs and a driving force."
      },
      {
        stepNumber: 2,
        title: "The Main Transformation & Mechanism",
        content: `Once activated, the components of ${cleanTopic} interact according to natural laws. Energy or information transfers from one component to another, reorganizing the system into a new state.`,
        example: `Like dominoes falling in a planned sequence where each piece triggers the next.`,
        whiteboardDraw: {
          type: "flow",
          title: "Phase 2: Core Mechanism",
          nodes: [
            { id: "react", label: "Interaction Point", subtext: "Key Transformation", iconType: "cpu", highlight: true },
            { id: "transfer", label: "Energy Transfer", subtext: "Work Being Done", iconType: "sparkles" },
            { id: "state_change", label: "State Shift", subtext: "New Properties", iconType: "arrow" }
          ],
          connections: [
            { from: "react", to: "transfer", label: "Powers" },
            { from: "transfer", to: "state_change", label: "Produces" }
          ],
          codeOrFormula: "State A → [Transfer of Energy / Information] → State B"
        },
        keyTakeaway: "The magic happens during the transition where energy and structure reorganize."
      },
      {
        stepNumber: 3,
        title: "The Final Outcome & Equilibrium",
        content: `After the interaction finishes, ${cleanTopic} reaches a stable outcome or cycles back to repeat. The resulting outputs sustain surrounding systems and demonstrate the principle in action.`,
        example: `Like a clock pendulum coming to balance or a bicycle reaching steady cruising speed.`,
        whiteboardDraw: {
          type: "cycle",
          title: "Phase 3: System Result & Cycle",
          nodes: [
            { id: "output", label: "Final Result", subtext: "Useful Work / State", iconType: "check", highlight: true },
            { id: "feedback", label: "System Feedback", subtext: "Maintains Balance", iconType: "zap" },
            { id: "sustainable", label: "Equilibrium", subtext: "Ready for Next Cycle", iconType: "sun" }
          ],
          connections: [
            { from: "output", to: "feedback", label: "Monitors" },
            { from: "feedback", to: "sustainable", label: "Balances" }
          ],
          codeOrFormula: "System Balance: Inputs = Outputs + Stored State"
        },
        keyTakeaway: "Understanding the final output reveals how the system stays balanced over time."
      }
    ],
    whiteboardSummary: {
      chalkboardTitle: `Mastering ${cleanTopic}: Summary`,
      corePrinciples: [
        `Understand the fundamental inputs and forces before memorizing formulas`,
        `Follow the step-by-step transformation from cause to effect`,
        `Connect the concept to an everyday real-world analogy to remember it forever`
      ],
      commonPitfalls: [
        `Trying to memorize isolated facts without understanding the underlying narrative`,
        `Confusing the cause of the reaction with the final byproduct`
      ],
      goldenRule: `Break big ideas into simple building blocks: inputs, transformation, and outcomes.`
    },
    speechScripts: {
      welcome: `Welcome! Guru is ready to explore ${cleanTopic} with you. Let's make this simple and fun!`,
      analogy: `Think of ${cleanTopic} like an artisan workshop where each step has a clear purpose and connects to the next.`,
      steps: [
        `In step one, we look at the raw ingredients and initial forces that start ${cleanTopic}.`,
        `In step two, we see the core transformation taking place as energy moves through the system.`,
        `In step three, we discover the final outcome and how everything reaches balance.`
      ],
      wrapup: `And that is the core of ${cleanTopic}! Try the quick quiz below to test your understanding!`
    },
    quiz: [
      {
        question: `What is the most effective way to understand how ${cleanTopic} works?`,
        options: [
          `By breaking it down into inputs, transformations, and outcomes`,
          `By memorizing technical jargon without understanding the steps`,
          `By ignoring the foundational rules`,
          `By assuming all systems work randomly`
        ],
        correctAnswer: 0,
        explanation: `Systems thinking breaks complex concepts into clear stages: starting conditions, active mechanisms, and final outcomes.`,
        hint: `Think about step-by-step logic.`
      },
      {
        question: `What drives the core transformation in ${cleanTopic}?`,
        options: [
          `An input force or energy transferring between components`,
          `Pure coincidence with no physical rules`,
          `A static system where nothing ever moves`,
          `An unmeasurable anomaly`
        ],
        correctAnswer: 0,
        explanation: `Transformations occur when energy, information, or matter transfers between parts of a system.`,
        hint: `Look for the option involving energy and forces.`
      },
      {
        question: `Why is reaching balance or equilibrium important in systems like ${cleanTopic}?`,
        options: [
          `It allows the system to remain stable and sustainable over time`,
          `It causes the entire system to stop permanently`,
          `It prevents any inputs from ever entering again`,
          `It erases all previous results`
        ],
        correctAnswer: 0,
        explanation: `Equilibrium ensures systems remain orderly, predictable, and capable of sustained operation.`,
        hint: `Focus on stability and sustainability.`
      }
    ],
    deepDivePrompts: [
      `How does ${cleanTopic} connect to other areas of science and daily technology?`,
      `What happens if one of the foundational inputs is changed or removed?`,
      `How did scientists and thinkers first discover the principles behind ${cleanTopic}?`
    ]
  };
}
