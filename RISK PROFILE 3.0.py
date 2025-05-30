class RiskProfile:
    def __init__(self):
        self.questions = [
            {   # Input Basic Information
                "question": "Please enter your name:",
                "options": None,
                "key": "name",
            },
            {   # Input PAN
                "question": "Please enter your PAN:",
                "options": None,
                "key": "pan",
            },
            {   # Question 1: Age
                "question": "What is your age range?",
                "options": {"a": "Below 30", "b": "30-45", "c": "45-60", "d": "Above 60"},
                "scores": {"a": 10, "b": 8, "c": 5, "d": 3},
            },
            {   # Question 2: Gender
                "question": "What is your gender?",
                "options": {"a": "Male", "b": "Female", "c": "Other"},
                "scores": {},
            },
            {   # Question 3: Education Level
                "question": "What is your highest level of education?",
                "options": {"a": "High School", "b": "Undergraduate", "c": "Postgraduate", "d": "Doctorate"},
                "scores": {"a": 5, "b": 8, "c": 10, "d": 10},
            },
            {   # Question 4: Marital Status
                "question": "What is your marital status?",
                "options": {"a": "Single", "b": "Married", "c": "Divorced", "d": "Widowed"},
                "scores": {},
            },
            {   # Question 5: Occupation
                "question": "What is your occupation?",
                "options": {"a": "Government Job", "b": "Private Job", "c": "Business", "d": "Unemployed"},
                "scores": {"a": 8, "b": 8, "c": 10, "d": 5},
            },
            {   # Question 6: Income Variance
                "question": "How consistent is your income?",
                "options": {"a": "Highly consistent", "b": "Somewhat consistent", "c": "Unpredictable"},
                "scores": {"a": 10, "b": 8, "c": 5},
            },
            {   # Question 7: Annual Income
                "question": "What is your annual income?",
                "options": {"a": "Below 5 Lakhs", "b": "5-10 Lakhs", "c": "10-20 Lakhs", "d": "20-50 Lakhs", "e": "Above 50 Lakhs"},
                "scores": {"a": 5, "b": 8, "c": 10, "d": 10, "e": 10 },
            },
            {   # Question 8: Income Sources
                "question": "Do you have single or multiple income sources?",
                "options": {"a": "Single", "b": "Multiple"},
                "scores": {"a": 8, "b": 10 },
            },
            {   # Question 9: Necessary Expenses
                "question": "What percentage of your income is consumed by necessary expenses such as food, rent, and EMIs?",
                "options": {"a": "Less than 30%", "b": "30-50%", "c": "50-70%", "d": "More than 70%"},
                "scores": {"a": 10, "b": 8, "c": 7, "d": 5},
            },

            {   # Question 10: Comfort with Volatility
                "question": "How comfortable are you with a 25% movement (up or down) in a single year?",
                "options": {"a": "Comfortable", "b": "Somewhat Comfortable", "c": "Not Comfortable"},
                "scores": {"a": 10, "b": 5, "c": 1},
            },
            {   # Question 11: Reaction to Loss
                "question": "You invested 1 Lakh, and it fell to 70,000. What would you do?",
                "options": {"a": "Sell all investments", "b": "Sell some investments", "c": "Hold the investment", "d": "Buy more investments"},
                "scores": {"a": 1, "b": 4, "c": 7, "d": 10},
            },
            {   # Question 12: Investment Priority
                "question": "What is most important to you while choosing an investment?",
                "options": {"a": "Safety of Capital", "b": "Moderate Returns", "c": "High Returns"},
                "scores": {"a": 1, "b": 5, "c": 10},
            },
            {   # Question 13: Gain and Loss Scenarios
                "question": "Given a choice between the following investments, which would you prefer?",
                "options": {"a": "Max Gain: 10%, Max Loss: 2%", "b": "Max Gain: 20%, Max Loss: 10%", "c": "Max Gain: 50%, Max Loss: 25%"},
                "scores": {"a": 1, "b": 5, "c": 10},
            },
            {   # Question 14: Investment Experience
                "question": "Do you have previous investment experience?",
                "options": {"a": "Yes", "b": "No"},
                "scores": {"a": 10, "b": 5},
                "follow_up": {
                    "a": {
                        "question": "When did you start investing? (Please enter the year)",
                        "options": None,
                        "key": "investment_start_year",
                    }
                }
            },
        ]
        self.total_score = 0
        self.answers = {}

    def ask_questions(self):
        for q in self.questions:
            print(q["question"])
            if q["options"]:
                for key, option in q["options"].items():
                    print(f"   {key}. {option}")

                while True:
                    answer = input("Your answer: ").strip().lower()
                    if answer in q["options"]:
                        if "scores" in q and answer in q["scores"]:
                            self.total_score += q["scores"][answer]
                        self.answers[q.get("key", q["question"])] = q["options"][answer]
                        break
                    else:
                        print("Invalid choice. Please choose a valid option.")
            else:
                answer = input("Your answer: ").strip()
                self.answers[q.get("key", q["question"])] = answer

    def categorize_profile(self):
        if self.total_score <= 40:
            return "Conservative"
        elif 41 <= self.total_score <= 90:
            return "Moderate"
        else:
            return "Aggressive"

    def determine_final_risk(self, profile, objective):
        risk_mapping = {
            ("Conservative", "Conservative"): "Conservative",
            ("Conservative", "Moderate"): "Conservative",
            ("Conservative", "Aggressive"): "Moderate",
            ("Moderate", "Moderate"): "Moderate",
            ("Moderate", "Aggressive"): "Moderate",
            ("Aggressive", "Aggressive"): "Aggressive",
        }
        return risk_mapping.get((profile, objective), "Moderate")

    def get_dynamic_allocation(self, risk_type, time_horizon):
        risk_constraints = {
            "Conservative": {"D_min": 70, "D_max": 90, "E_min": 10, "E_max": 15, "G_min": 5, "G_max": 10},
            "Moderate": {"D_min": 50, "D_max": 70, "E_min": 30, "E_max": 50, "G_min": 5, "G_max": 10},
            "Aggressive": {"D_min": 10, "D_max": 30, "E_min": 60, "E_max": 80, "G_min": 5, "G_max": 10},
        }
    
        time_horizon_modifier = {
            "Short-term (Less than 3 years)": 0,
            "Medium-term (3-7 years)": 0.5,
            "Long-term (More than 7 years)": 1,
        }
    
        if risk_type not in risk_constraints or time_horizon not in time_horizon_modifier:
            return {"debt": 50, "equity": 40, "gold": 10}  # Default allocation
    
        thm = time_horizon_modifier[time_horizon]
        constraints = risk_constraints[risk_type]
    
        # Calculate initial allocations
        debt = constraints["D_min"] + thm * (constraints["D_max"] - constraints["D_min"])
        equity = constraints["E_min"] + thm * (constraints["E_max"] - constraints["E_min"])
        gold = constraints["G_min"] + thm * (constraints["G_max"] - constraints["G_min"])
    
        # Round values
        debt = round(debt)
        equity = round(equity)
        gold = round(gold)
    
        total = debt + equity + gold
    
        if total > 100:
            # Scale down proportionally
            scaling_factor = 100 / total
            debt = round(debt * scaling_factor)
            equity = round(equity * scaling_factor)
            gold = max(0, 100 - (debt + equity))  # Adjust to ensure total is 100
        elif total < 100:
            # Adjust gold to fill the gap
            gold = max(0, 100 - (debt + equity))
    
        return {"debt": debt, "equity": equity, "gold": gold}

    def run(self):
        self.ask_questions()
        profile = self.categorize_profile()

        objective_map = {
            "a": ("Park money for short term", "Conservative"),
            "b": ("Invest for regular income", "Moderate"),
            "c": ("Invest for higher return on savings", "Aggressive"),
        }

        print("\nWhat is your investment objective?")
        for key, (description, _) in objective_map.items():
            print(f"   {key}. {description}")

        while True:
            objective_choice = input("Your choice: ").strip().lower()
            if objective_choice in objective_map:
                objective = objective_map[objective_choice][1]  # Extract risk type
                break
            print("Invalid choice. Please select a valid option.")

        final_risk = self.determine_final_risk(profile, objective)
        print(f"\nYour final risk portfolio type is: {final_risk}")

        time_horizon_map = {
            "a": "Short-term (Less than 3 years)",
            "b": "Medium-term (3-7 years)",
            "c": "Long-term (More than 7 years)",
        }

        print("\nHow long do you plan to stay invested?")
        for key, value in time_horizon_map.items():
            print(f"   {key}. {value}")

        while True:
            time_horizon_choice = input("Your choice: ").strip().lower()
            if time_horizon_choice in time_horizon_map:
                time_horizon = time_horizon_map[time_horizon_choice]
                break
            print("Invalid choice. Please select a valid option.")

        allocation = self.get_dynamic_allocation(final_risk, time_horizon)

        print("\n--- FINAL INVESTMENT PROFILE ---")
        print(f"Risk Profile: {final_risk}")
        print(f"Time Horizon: {time_horizon}")
        print(f"Asset Allocation: Debt {allocation['debt']}%, Equity {allocation['equity']}%, Gold {allocation['gold']}%")


if __name__ == "__main__":
    RiskProfile().run()