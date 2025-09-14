document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const objectiveInput = document.getElementById('objective');
    const durationInput = document.getElementById('duration');
    const resultDiv = document.getElementById('result');
    const resultText = document.getElementById('result-text');
    const copyBtn = document.getElementById('copy-btn');
    const errorMessageDiv = document.getElementById('error-message');

    // Event listener for the generate button
    generateBtn.addEventListener('click', async () => {
        const objective = objectiveInput.value.trim();
        const duration = durationInput.value.trim();

        if (!objective) {
            showError("الرجاء إدخال الهدف التعليمي.");
            return;
        }

        const prompt = `
        قم بإنشاء خطة درس لمربية تعليم أولي في المغرب باللغة العربية.
        الهدف التعليمي: ${objective}.
        المدة الزمنية: ${duration}.
        
        يجب أن تتبع الخطة الهيكل التالي:
        1.  **المرحلة التمهيدية:** (نشاط قصير لجذب انتباه الأطفال)
        2.  **مرحلة البناء:** (النشاط الرئيسي خطوة بخطوة)
        3.  **المرحلة الختامية:** (نشاط لتقييم الفهم أو تهدئة الأطفال)
        `;

        showLoading(true);
        hideError();
        resultDiv.classList.add('hidden');

        try {
            // This is the updated part: call our own API endpoint
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'حدث خطأ غير متوقع.');
            }

            const data = await response.json();
            
            resultText.textContent = data.text;
            resultDiv.classList.remove('hidden');

        } catch (error) {
            showError(`عذرًا، حدث خطأ: ${error.message}`);
            console.error('Error:', error);
        } finally {
            showLoading(false);
        }
    });
    
    // Copy to clipboard
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(resultText.textContent).then(() => {
            copyBtn.textContent = 'تم النسخ!';
            setTimeout(() => {
                copyBtn.textContent = 'نسخ النص';
            }, 2000);
        });
    });

    function showLoading(isLoading) {
        generateBtn.disabled = isLoading;
        generateBtn.querySelector('span').textContent = isLoading ? 'جاري الإنشاء...' : 'إنشاء خطة الدرس';
    }

    function showError(message) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.classList.remove('hidden');
    }

    function hideError() {
        errorMessageDiv.classList.add('hidden');
    }

    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tab = btn.getAttribute('data-tab');
            tabContents.forEach(c => c.classList.remove('active'));
            document.getElementById(`${tab}-tab`).classList.add('active');
        });
    });
});
