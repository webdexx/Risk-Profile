// Question data with comprehensive risk assessment
const questions = [
    { question: "Please enter your name:", key: "name" },
    { question: "Please enter your PAN:", key: "pan" },
    { question: "What is your age range?", options: { a: "Below 30", b: "30-45", c: "45-60", d: "Above 60" }, scores: { a: 10, b: 8, c: 5, d: 3 } },
    { question: "What is your gender?", options: { a: "Male", b: "Female", c: "Other" } },
    { question: "What is your highest level of education?", options: { a: "High School", b: "Undergraduate", c: "Postgraduate", d: "Doctorate" }, scores: { a: 5, b: 8, c: 10, d: 10 } },
    { question: "What is your marital status?", options: { a: "Single", b: "Married", c: "Divorced", d: "Widowed" } },
    { question: "What is your occupation?", options: { a: "Government Job", b: "Private Job", c: "Business", d: "Unemployed" }, scores: { a: 8, b: 8, c: 10, d: 5 } },
    { question: "How consistent is your income?", options: { a: "Highly consistent", b: "Somewhat consistent", c: "Unpredictable" }, scores: { a: 10, b: 8, c: 5 } },
    { question: "What is your annual income?", options: { a: "Below 5 Lakhs", b: "5-10 Lakhs", c: "10-20 Lakhs", d: "20-50 Lakhs", e: "Above 50 Lakhs" }, scores: { a: 5, b: 8, c: 10, d: 10, e: 10 } },
    { question: "Do you have single or multiple income sources?", options: { a: "Single", b: "Multiple" }, scores: { a: 8, b: 10 } },
    { question: "What percentage of your income is consumed by necessary expenses such as food, rent, and EMIs?", options: { a: "Less than 30%", b: "30-50%", c: "50-70%", d: "More than 70%" }, scores: { a: 10, b: 8, c: 7, d: 5 } },
    { question: "How comfortable are you with a 25% movement (up or down) in a single year?", options: { a: "Comfortable", b: "Somewhat Comfortable", c: "Not Comfortable" }, scores: { a: 10, b: 5, c: 1 } },
    { question: "You invested 1 Lakh, and it fell to 70,000. What would you do?", options: { a: "Sell all investments", b: "Sell some investments", c: "Hold the investment", d: "Buy more investments" }, scores: { a: 1, b: 4, c: 7, d: 10 } },
    { question: "What is most important to you while choosing an investment?", options: { a: "Safety of Capital", b: "Moderate Returns", c: "High Returns" }, scores: { a: 1, b: 5, c: 10 } },
    { question: "Given a choice between the following investments, which would you prefer?", options: { a: "Max Gain: 10%, Max Loss: 2%", b: "Max Gain: 20%, Max Loss: 10%", c: "Max Gain: 50%, Max Loss: 25%" }, scores: { a: 1, b: 5, c: 10 } },
    { question: "Do you have previous investment experience?", options: { a: "Yes", b: "No" }, scores: { a: 10, b: 5 }, follow_up: { a: { question: "When did you start investing? (Please enter the year)", options: null, key: "investment_start_year" } } },
];

// Initialize variables
let currentQuestion = 0;
let answers = {};
let totalScore = 0;
let progressChart, resultsChart;
let generatedOtp = '';
let otpTimer = null;
let otpTimeLeft = 60;

// Initialize the progress chart
function initProgressChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    progressChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [0, 100],
                backgroundColor: ['#0070ba', '#f1f1f1'],
                borderWidth: 0,
                circumference: 360
            }]
        },
        options: {
            cutout: '80%',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Update progress chart
function updateProgress() {
    const progress = (currentQuestion / questions.length) * 100;
    const remaining = 100 - progress;
    
    progressChart.data.datasets[0].data = [progress, remaining];
    progressChart.update('none'); // Use 'none' for smoother updates
    
    document.getElementById('progress-percentage').textContent = `${Math.round(progress)}%`;
}

// Display current question
function displayQuestion(isFirst = false, direction = 'right') {
    slideToQuestion(currentQuestion, isFirst ? 'right' : direction);
    const question = questions[currentQuestion];
    document.getElementById('question-text').textContent = question.question;
    const optionsContainer = document.querySelector('.options');
    optionsContainer.innerHTML = '';
    if (question.options) {
        Object.entries(question.options).forEach(([key, value]) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = value;
            button.onclick = () => selectAnswer(key, direction);
            optionsContainer.appendChild(button);
        });
    } else {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'text-input';
        input.placeholder = 'Enter your answer';
        input.onkeypress = (e) => {
            if (e.key === 'Enter') {
                selectAnswer(input.value, direction);
            }
        };
        optionsContainer.appendChild(input);
    }
}

// Handle answer selection
function selectAnswer(answer, direction = 'right') {
    const question = questions[currentQuestion];
    
    // Validate PAN if it's a PAN question
    if (question.key === 'pan') {
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(answer)) {
            alert('Please enter a valid PAN number in the format: ABCDE1234F');
            return;
        }
    }
    
    // Validate name if it's a name question
    if (question.key === 'name') {
        if (!/^[a-zA-Z\s]{2,50}$/.test(answer)) {
            alert('Please enter a valid name (2-50 characters, letters and spaces only)');
            return;
        }
    }
    
    // Validate investment year if it's a follow-up question
    if (question.key === 'investment_start_year') {
        const year = parseInt(answer);
        const currentYear = new Date().getFullYear();
        if (isNaN(year) || year < 1900 || year > currentYear) {
            alert(`Please enter a valid year between 1900 and ${currentYear}`);
            return;
        }
    }
    
    // Validate mobile number
    if (question.key === 'mobile') {
        if (!/^[6-9]\d{9}$/.test(answer)) {
            alert('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9');
            return;
        }
    }
    
    answers[question.key || question.question] = question.options ? question.options[answer] : answer;
    
    // Update score if applicable
    if (question.scores && question.scores[answer]) {
        totalScore += question.scores[answer];
    }
    
    // Handle follow-up question for investment experience
    if (question.question === "Do you have previous investment experience?" && answer === 'a') {
        const followUpQuestion = question.follow_up.a;
        questions.splice(currentQuestion + 1, 0, followUpQuestion);
    }
    
    currentQuestion++;
    
    if (currentQuestion < questions.length) {
        updateProgress();
        displayQuestion(false, direction);
    } else {
        showFinalQuestions();
    }
}

// Show final questions modal
function showFinalQuestions() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Final Questions</h2>
            <div class="investment-objective">
                <h3>What is your investment objective?</h3>
                <div class="options-container">
                    <div class="option" data-value="Conservative">
                        <input type="radio" name="objective" value="Conservative" style="display:none;">
                        <span class="custom-radio"></span>
                        <span class="option-label">Park money for short term</span>
                    </div>
                    <div class="option" data-value="Moderate">
                        <input type="radio" name="objective" value="Moderate" style="display:none;">
                        <span class="custom-radio"></span>
                        <span class="option-label">Invest for regular income</span>
                    </div>
                    <div class="option" data-value="Aggressive">
                        <input type="radio" name="objective" value="Aggressive" style="display:none;">
                        <span class="custom-radio"></span>
                        <span class="option-label">Invest for higher return on savings</span>
                    </div>
                </div>
            </div>
            <div class="time-horizon">
                <h3>How long do you plan to stay invested?</h3>
                <div class="options-container">
                    <div class="option" data-value="Short-term (Less than 3 years)">
                        <input type="radio" name="timeHorizon" value="Short-term (Less than 3 years)" style="display:none;">
                        <span class="custom-radio"></span>
                        <span class="option-label">Short-term (Less than 3 years)</span>
                    </div>
                    <div class="option" data-value="Medium-term (3-7 years)">
                        <input type="radio" name="timeHorizon" value="Medium-term (3-7 years)" style="display:none;">
                        <span class="custom-radio"></span>
                        <span class="option-label">Medium-term (3-7 years)</span>
                    </div>
                    <div class="option" data-value="Long-term (More than 7 years)">
                        <input type="radio" name="timeHorizon" value="Long-term (More than 7 years)" style="display:none;">
                        <span class="custom-radio"></span>
                        <span class="option-label">Long-term (More than 7 years)</span>
                    </div>
                </div>
            </div>
            <button id="calculateResults">Calculate Results</button>
        </div>
    `;

    document.body.appendChild(modal);

    // Make .option fully clickable and visually selected
    modal.querySelectorAll('.options-container').forEach(container => {
        const options = container.querySelectorAll('.option');
        options.forEach(option => {
            option.addEventListener('click', function() {
                // Unselect all in this container
                options.forEach(opt => opt.classList.remove('selected'));
                // Select this one
                this.classList.add('selected');
                // Check the input
                this.querySelector('input[type="radio"]').checked = true;
            });
        });
    });

    document.getElementById('calculateResults').addEventListener('click', () => {
        const objective = modal.querySelector('input[name="objective"]:checked')?.value;
        const timeHorizon = modal.querySelector('input[name="timeHorizon"]:checked')?.value;

        if (!objective || !timeHorizon) {
            alert('Please answer both questions before proceeding.');
            return;
        }

        // Show Lottie transition for 6 seconds, then show results
        showLottieTransition(() => {
            calculateAndShowResults(objective, timeHorizon);
            modal.remove();
        });
    });
}

// Show Lottie transition overlay for 6 seconds
function showLottieTransition(callback) {
    // Create overlay
    const lottieOverlay = document.createElement('div');
    lottieOverlay.id = 'lottieTransitionOverlay';
    lottieOverlay.style.position = 'fixed';
    lottieOverlay.style.top = '0';
    lottieOverlay.style.left = '0';
    lottieOverlay.style.width = '100vw';
    lottieOverlay.style.height = '100vh';
    lottieOverlay.style.background = 'rgba(255,255,255, 1)';
    lottieOverlay.style.display = 'flex';
    lottieOverlay.style.justifyContent = 'center';
    lottieOverlay.style.alignItems = 'center';
    lottieOverlay.style.zIndex = '900';
    lottieOverlay.innerHTML = `
        <div style="display: flex; flex-direction: row; align-items: center; gap: 40px;">
            <div>
                <h2 style="text-align:center; color: #0070ba;">Generating Results. Please wait.. </h2>
                <dotlottie-player src="https://lottie.host/dcbbd27f-8c84-4f98-8544-fa041e92e0cb/F5WjgAYuKD.lottie" background="transparent" speed="1" style="width: 300px; height: 300px" loop autoplay></dotlottie-player>
            </div>
        </div>
    `;
    document.body.appendChild(lottieOverlay);

    // Remove after 6 seconds and call callback
    setTimeout(() => {
        lottieOverlay.remove();
        if (typeof callback === 'function') callback();
    }, 3000);
}

// Calculate and show results
function calculateAndShowResults(objective, timeHorizon) {
    const profile = categorizeProfile(totalScore);
    const finalRisk = determineFinalRisk(profile, objective);
    const allocation = getDynamicAllocation(finalRisk, timeHorizon);

    // Show results section
    document.querySelector('.questions-section').style.display = 'none';
    document.querySelector('.results-section').style.display = 'grid';
    document.querySelector('.suggestions-section').style.display = 'block';

    // Update results content
    document.getElementById('profile-type').textContent = finalRisk;
    
    const resultsContent = document.getElementById('results-content');
    resultsContent.innerHTML = `
        <h3>Risk Profile: ${finalRisk}</h3>
        <div class="allocation-details">
            <p>Recommended Asset Allocation:</p>
            <ul>
                <li>Debt: ${allocation.debt}%</li>
                <li>Equity: ${allocation.equity}%</li>
                <li>Gold: ${allocation.gold}%</li>
            </ul>
        </div>
    `;

    // Display results chart
    displayResultsChart(finalRisk, allocation);
    
    // Display suggestions
    displaySuggestions(finalRisk);
}

// Categorize risk profile
function categorizeProfile(score) {
    if (score <= 40) return "Conservative";
    else if (score <= 90) return "Moderate";
    else return "Aggressive";
}

// Determine final risk profile
function determineFinalRisk(profile, objective) {
    const riskMapping = {
        "Conservative,Conservative": "Conservative",
        "Conservative,Moderate": "Conservative",
        "Conservative,Aggressive": "Moderate",
        "Moderate,Moderate": "Moderate",
        "Moderate,Aggressive": "Moderate",
        "Aggressive,Aggressive": "Aggressive"
    };
    return riskMapping[`${profile},${objective}`] || "Moderate";
}

// Calculate dynamic allocation
function getDynamicAllocation(riskType, timeHorizon) {
    const riskConstraints = {
        "Conservative": {D_min: 70, D_max: 90, E_min: 10, E_max: 15, G_min: 5, G_max: 10},
        "Moderate": {D_min: 50, D_max: 70, E_min: 30, E_max: 50, G_min: 5, G_max: 10},
        "Aggressive": {D_min: 10, D_max: 30, E_min: 60, E_max: 80, G_min: 5, G_max: 10}
    };

    const timeHorizonModifier = {
        "Short-term (Less than 3 years)": 0,
        "Medium-term (3-7 years)": 0.5,
        "Long-term (More than 7 years)": 1
    };

    if (!(riskType in riskConstraints) || !(timeHorizon in timeHorizonModifier)) {
        return {debt: 50, equity: 40, gold: 10};
    }

    const thm = timeHorizonModifier[timeHorizon];
    const constraints = riskConstraints[riskType];

    let debt = constraints.D_min + thm * (constraints.D_max - constraints.D_min);
    let equity = constraints.E_min + thm * (constraints.E_max - constraints.E_min);
    let gold = constraints.G_min + thm * (constraints.G_max - constraints.G_min);

    debt = Math.round(debt);
    equity = Math.round(equity);
    gold = Math.round(gold);

    const total = debt + equity + gold;

    if (total > 100) {
        const scalingFactor = 100 / total;
        debt = Math.round(debt * scalingFactor);
        equity = Math.round(equity * scalingFactor);
        gold = Math.max(0, 100 - (debt + equity));
    } else if (total < 100) {
        gold = Math.max(0, 100 - (debt + equity));
    }

    return {debt, equity, gold};
}

// Display results chart
function displayResultsChart(riskProfile, allocation) {
    const ctx = document.getElementById('resultsChart').getContext('2d');
    
    if (resultsChart) {
        resultsChart.destroy();
    }
    
    resultsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Debt', 'Equity', 'Gold'],
            datasets: [{
                data: [allocation.debt, allocation.equity, allocation.gold],
                backgroundColor: [
                    '#4e73df', // Debt - blue
                    '#1cc88a', // Equity - green
                    '#f6c23e'  // Gold - yellow
                ],
                hoverBackgroundColor: [
                    '#2e59d9',
                    '#17a673',
                    '#dda20a'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Your ${riskProfile} Portfolio Allocation`,
                    font: {
                        size: 16,
                        family: '"Outfit", sans-serif'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: '"Outfit", sans-serif',
                            size: 12
                        },
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            },
            cutout: '65%',
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
}

// Display suggestions
function displaySuggestions(riskProfile) {
    const suggestions = generateSuggestions(riskProfile);
    const tbody = document.querySelector('#suggestions-table tbody');
    tbody.innerHTML = '';
    
    suggestions.forEach(suggestion => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${suggestion.category}</td>
            <td>${suggestion.recommendation}</td>
            <td>${suggestion.priority}</td>
        `;
        tbody.appendChild(row);
    });
}

// Generate suggestions based on risk profile
function generateSuggestions(riskProfile) {
    const suggestions = {
        "Conservative": [
            {
                category: 'Fixed Income',
                recommendation: 'Consider investing in high-quality corporate bonds and government securities',
                priority: 'High'
            },
            {
                category: 'Equity',
                recommendation: 'Focus on large-cap stocks and dividend-paying companies',
                priority: 'Medium'
            },
            {
                category: 'Gold',
                recommendation: 'Maintain 5-10% allocation in gold for portfolio stability',
                priority: 'Medium'
            }
        ],
        "Moderate": [
            {
                category: 'Equity',
                recommendation: 'Balance between large-cap and mid-cap stocks',
                priority: 'High'
            },
            {
                category: 'Fixed Income',
                recommendation: 'Mix of government bonds and high-quality corporate bonds',
                priority: 'High'
            },
            {
                category: 'Diversification',
                recommendation: 'Consider adding international exposure',
                priority: 'Medium'
            }
        ],
        "Aggressive": [
            {
                category: 'Equity',
                recommendation: 'Higher allocation to mid-cap and small-cap stocks',
                priority: 'High'
            },
            {
                category: 'Sector Focus',
                recommendation: 'Consider thematic investments in growth sectors',
                priority: 'Medium'
            },
            {
                category: 'Risk Management',
                recommendation: 'Use stop-loss orders and maintain emergency fund',
                priority: 'High'
            }
        ]
    };
    
    return suggestions[riskProfile];
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Hide results and suggestions sections initially
    document.querySelector('.results-section').style.display = 'none';
    document.querySelector('.suggestions-section').style.display = 'none';
    
    // Show auth step initially
    document.getElementById('authStep').style.display = 'block';
    document.getElementById('progressStep').style.display = 'none';
    document.getElementById('questionStep').style.display = 'none';
    
    // Initialize auth event listeners
    initializeAuth();

    // Initialize navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.addEventListener('click', function () {
        if (currentQuestion > 0) {
            currentQuestion--;
            updateProgress();
            displayQuestion(false, 'left');
            nextBtn.disabled = false;
        }
        if (currentQuestion === 0) {
            prevBtn.disabled = true;
        }
    });

    nextBtn.addEventListener('click', function () {
        const question = questions[currentQuestion];
        let answer = null;
        if (!question.options) {
            const input = document.querySelector('.options input');
            answer = input.value;
            if (!answer) {
                alert('Please enter your answer.');
                return;
            }
            selectAnswer(answer, 'right');
        }
        // For options, answer is set by button click (handled in selectAnswer)
    });
});

// Initialize authentication
function initializeAuth() {
    const mobileForm = document.getElementById('mobileForm');
    const mobileInput = document.getElementById('mobileNumber');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const otpContainer = document.getElementById('otpContainer');
    const dummyOtpDiv = document.getElementById('dummyOtp');
    const otpInputs = otpContainer.querySelectorAll('.otp-input input');
    const otpTimerSpan = document.getElementById('otpTimer');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');

    // Handle mobile form submission
    mobileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const mobileNumber = mobileInput.value.trim();
        
        // Validate mobile number
        if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
            alert('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9');
            return;
        }

        // Generate and display OTP
        generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
        dummyOtpDiv.textContent = `Your OTP: ${generatedOtp}`;
        otpContainer.style.display = 'block'; // Show OTP container
        sendOtpBtn.disabled = true;
        mobileInput.disabled = true;

        // Clear and enable OTP inputs
        otpInputs.forEach(input => {
            input.value = '';
            input.disabled = false;
        });

        // Start OTP timer
        startOtpTimer(otpTimerSpan, verifyOtpBtn, dummyOtpDiv);
    });

    // Handle OTP verification
    verifyOtpBtn.addEventListener('click', function() {
        const enteredOtp = Array.from(otpInputs).map(input => input.value).join('');
        
        // Validate that all OTP fields are filled
        const allFieldsFilled = Array.from(otpInputs).every(input => input.value.length === 1);
        if (!allFieldsFilled) {
            dummyOtpDiv.textContent = 'Please enter all 4 digits of the OTP';
            dummyOtpDiv.style.color = '#dc3545';
            return;
        }
        
        if (enteredOtp === generatedOtp) {
            clearInterval(otpTimer);
            showOtpSuccessAndSlideToQuestions();
        } else {
            dummyOtpDiv.textContent = 'Incorrect OTP. Please try again.';
            dummyOtpDiv.style.color = '#dc3545';
            // Clear OTP inputs
            otpInputs.forEach(input => {
                input.value = '';
                input.focus();
            });
        }
    });

    // Handle OTP input
    otpInputs.forEach((input, idx) => {
        input.addEventListener('input', function() {
            // Only allow numbers
            this.value = this.value.replace(/[^0-9]/g, '');
            
            if (this.value.length === 1 && idx < otpInputs.length - 1) {
                otpInputs[idx + 1].focus();
            }
        });

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value === '' && idx > 0) {
                otpInputs[idx - 1].focus();
            }
        });
    });
}

// Start OTP timer
function startOtpTimer(timerSpan, verifyBtn, dummyOtpDiv) {
    otpTimeLeft = 60;
    timerSpan.textContent = otpTimeLeft;
    
    if (otpTimer) clearInterval(otpTimer);
    
    otpTimer = setInterval(() => {
        otpTimeLeft--;
        timerSpan.textContent = otpTimeLeft;
        
        if (otpTimeLeft <= 0) {
            clearInterval(otpTimer);
            verifyBtn.disabled = true;
            dummyOtpDiv.textContent = 'OTP expired. Please refresh to try again.';
        }
    }, 1000);
}

// Show OTP success message and slide to questions
function showOtpSuccessAndSlideToQuestions() {
    const otpSuccess = document.getElementById('otpSuccessMessage');
    otpSuccess.textContent = 'OTP Verified Successfully!';
    otpSuccess.style.display = 'block';
    otpSuccess.style.color = '#28a745';
    setTimeout(() => {
        otpSuccess.style.display = 'none';
        document.getElementById('authStep').style.display = 'none';
        document.getElementById('progressStep').style.display = 'block';
        document.getElementById('questionStep').style.display = 'block';
        // Initialize progress and first question
        initProgressChart();
        updateProgress();
        displayQuestion(true); // pass true to indicate first slide-in
    }, 1000);
}

// Sliding transition for questions
function slideToQuestion(nextIndex, direction = 'right') {
    const questionStep = document.getElementById('questionStep');
    const allQuestions = [questionStep]; // Only one question container, but keep for future extensibility
    // Remove all slide classes
    allQuestions.forEach(q => {
        q.classList.remove('slide-in-right', 'slide-out-left', 'active');
    });
    if (direction === 'right') {
        questionStep.classList.add('slide-in-right', 'active');
    } else {
        questionStep.classList.add('slide-out-left', 'active');
    }
    // Remove slide classes after animation
    setTimeout(() => {
        questionStep.classList.remove('slide-in-right', 'slide-out-left');
    }, 500);
} 