document.addEventListener('DOMContentLoaded', function() {
    // Sliders
    const numDocs = document.getElementById('num-docs');
    const patientsPerDay = document.getElementById('patients-per-day');
    const consultFee = document.getElementById('consult-fee');
    const pharmacyBills = document.getElementById('pharmacy-bills');
    const pharmacyBillAmt = document.getElementById('pharmacy-bill-amt');
    const auditHours = document.getElementById('audit-hours');
    const expiryLeakage = document.getElementById('expiry-leakage');

    // Values Display
    const valNumDocs = document.getElementById('val-num-docs');
    const valPatients = document.getElementById('val-patients');
    const valFee = document.getElementById('val-fee');
    const valBills = document.getElementById('val-bills');
    const valBillAmt = document.getElementById('val-bill-amt');
    const valHours = document.getElementById('val-hours');
    const valLeakage = document.getElementById('val-leakage');

    // Results Display
    const resTimeSaved = document.getElementById('res-time-saved');
    const resRevenueLeakage = document.getElementById('res-revenue-leakage');
    const resPaperSavings = document.getElementById('res-paper-savings');
    const resMonthlyYield = document.getElementById('res-monthly-yield');
    const resAnnualSavings = document.getElementById('res-annual-savings');
    const resRoiPercent = document.getElementById('res-roi-percent');

    function calculateROI() {
        // Parse slider inputs
        const docs = parseInt(numDocs.value);
        const patients = parseInt(patientsPerDay.value);
        const fee = parseFloat(consultFee.value);
        const pBills = parseInt(pharmacyBills.value);
        const pBillAmt = parseFloat(pharmacyBillAmt.value);
        const hours = parseFloat(auditHours.value);
        const leakage = parseFloat(expiryLeakage.value);

        // Update slider value indicators
        if (valNumDocs) valNumDocs.textContent = docs;
        if (valPatients) valPatients.textContent = patients;
        if (valFee) valFee.textContent = `₹${fee}`;
        if (valBills) valBills.textContent = pBills;
        if (valBillAmt) valBillAmt.textContent = `₹${pBillAmt}`;
        if (valHours) valHours.textContent = `${hours}h`;
        if (valLeakage) valLeakage.textContent = `₹${leakage}`;

        // 26 working days in a month
        const workingDays = 26;

        // 1. Time Saved calculations
        // (4 mins saved per patient using autocomplete stock suggestions + history copying)
        const doctorTimeSaved = (docs * patients * 4 / 60) * workingDays;
        // (80% time saved on compiling sales registry, GST reports and GSTR-1 preparation)
        const auditTimeSaved = hours * 0.8;
        const totalTimeSaved = Math.round(doctorTimeSaved + auditTimeSaved);

        // 2. Revenue Leakage calculations
        // (95% reduction in expired medicine wastage due to expiry warning widgets and FIFO batches)
        const leakageRecovered = leakage * 0.95;
        // (recovering lost walk-in pharmacy sales by swapping out-of-stock medicines instantly with available generics)
        const genericSubstitutionRecovery = (pBills * 0.1) * pBillAmt * 0.3 * workingDays;
        const totalRevenueLeakage = Math.round(leakageRecovered + genericSubstitutionRecovery);

        // 3. Operational Cost Savings
        // (saving ₹2.5 on paper, printing, prescription slip, and carbon billing records by utilizing digital PDF Rx and SMS logs)
        const totalPaperBills = ((docs * patients) + pBills) * workingDays;
        const totalPaperSavings = Math.round(totalPaperBills * 2.5);

        // 4. Totals
        const monthlyYield = totalRevenueLeakage + totalPaperSavings;
        const annualSavings = monthlyYield * 12;

        // ROI percentage calculation based on standard one-time deployment license fee of ₹45,000
        const deploymentCost = 45000;
        const roiPercent = Math.round((annualSavings / deploymentCost) * 100);

        // Render formatted outputs
        if (resTimeSaved) resTimeSaved.textContent = `${totalTimeSaved} Hours`;
        if (resRevenueLeakage) resRevenueLeakage.textContent = `₹${totalRevenueLeakage.toLocaleString('en-IN')}`;
        if (resPaperSavings) resPaperSavings.textContent = `₹${totalPaperSavings.toLocaleString('en-IN')}`;
        if (resMonthlyYield) resMonthlyYield.textContent = `₹${monthlyYield.toLocaleString('en-IN')}`;
        if (resAnnualSavings) resAnnualSavings.textContent = `₹${annualSavings.toLocaleString('en-IN')}`;
        if (resRoiPercent) resRoiPercent.textContent = `${roiPercent}%`;
    }

    // Attach listeners
    const inputs = [numDocs, patientsPerDay, consultFee, pharmacyBills, pharmacyBillAmt, auditHours, expiryLeakage];
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('input', calculateROI);
            input.addEventListener('change', calculateROI);
        }
    });

    // Run on initial load
    calculateROI();
});
