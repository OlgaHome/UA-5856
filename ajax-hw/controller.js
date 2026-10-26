class CurrencyController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.isLoading = false;

        this.view.form.addEventListener("submit", (event) => {
            event.preventDefault();

            const display = event.submitter?.value ?? "chart";
            this.loadRates(display);
        });
    }

    async loadRates(display) {
        if (this.isLoading) {
            return;
        }

        const { currency, startDate, endDate } =
            this.view.getParameters();

        this.view.clearResults();

        if (!startDate || !endDate) {
            this.view.showMessage("Оберіть обидві дати.", true);
            return;
        }

        if (startDate > endDate) {
            this.view.showMessage(
                "Початкова дата не може бути пізнішою за кінцеву.",
                true
            );
            return;
        }

        this.isLoading = true;
        this.view.setLoading(true);
        this.view.showMessage("Завантаження курсів із НБУ…");

        try {
            const rates = await this.model.getRates(
                currency,
                startDate,
                endDate
            );

            if (rates.length === 0) {
                this.view.showMessage(
                    "За обраний період даних немає."
                );
                return;
            }

            if (display === "table") {
                this.view.showTable(rates, currency);
            } else {
                this.view.showChart(rates, currency);
            }

            this.view.showMessage(
                `Завантажено записів: ${rates.length}. ` +
                `Валюта: ${currency}. Період: ${startDate} — ${endDate}.`
            );
        } catch (error) {
            this.view.clearResults();

            this.view.showMessage(
                `Не вдалося показати курси. ${error.message}`,
                true
            );

            console.error(error);
        } finally {
            this.isLoading = false;
            this.view.setLoading(false);
        }
    }
}

const currencyModel = new CurrencyModel();
const currencyView = new CurrencyView();

const currencyController = new CurrencyController(
    currencyModel,
    currencyView
);