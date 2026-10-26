class CurrencyView {
    constructor() {
        this.form = document.getElementById("currency-form");
        this.currencyInput = document.getElementById("currency");
        this.startInput = document.getElementById("start-date");
        this.endInput = document.getElementById("end-date");

        this.message = document.getElementById("message");
        this.chartSection = document.getElementById("chart-section");
        this.tableSection = document.getElementById("table-section");
        this.chartTitle = document.getElementById("chart-title");
        this.canvas = document.getElementById("rates-chart");
        this.tableBody = document.getElementById("rates-table-body");

        this.chart = null;
    }

    getParameters() {
        return {
            currency: this.currencyInput.value,
            startDate: this.startInput.value,
            endDate: this.endInput.value
        };
    }

    setLoading(isLoading) {
        const buttons = this.form.querySelectorAll("button");

        for (const button of buttons) {
            button.disabled = isLoading;
        }

        this.form.setAttribute("aria-busy", String(isLoading));
    }

    showMessage(text, isError = false) {
        this.message.textContent = text;
        this.message.className = isError
            ? "mt-3 text-danger"
            : "mt-3 text-muted";
    }

    clearResults() {
        this.chartSection.hidden = true;
        this.tableSection.hidden = true;
        this.tableBody.replaceChildren();

        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }

    showChart(rates, currency) {
        this.clearResults();

        if (typeof Chart === "undefined") {
            throw new Error(
                "Не вдалося завантажити Chart.js. Оновіть сторінку."
            );
        }

        this.chartSection.hidden = false;
        this.chartTitle.textContent = `Курс ${currency} до гривні`;

        this.chart = new Chart(this.canvas, {
            type: "line",

            data: {
                labels: rates.map((item) => item.date),

                datasets: [{
                    label: `Грн за 1 ${currency}`,
                    data: rates.map((item) => item.rate),
                    borderColor: "#0d6efd",
                    backgroundColor: "#0d6efd",
                    borderWidth: 2,
                    pointRadius: 3,
                    tension: 0,
                    fill: false
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Дата"
                        }
                    },

                    y: {
                        title: {
                            display: true,
                            text: "Курс, грн"
                        },

                        ticks: {
                            callback: (value) =>
                                Number(value).toFixed(4)
                        }
                    }
                },

                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) =>
                                `${context.parsed.y.toFixed(4)} грн`
                        }
                    }
                }
            }
        });
    }

    showTable(rates, currency) {
        this.clearResults();

        for (const item of rates) {
            const row = document.createElement("tr");

            const values = [
                item.date,
                currency,
                item.rate.toFixed(4)
            ];

            for (const value of values) {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.append(cell);
            }

            this.tableBody.append(row);
        }

        this.tableSection.hidden = false;
    }
}