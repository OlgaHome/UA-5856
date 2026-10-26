class CurrencyModel {
    constructor() {
        this.rates = [];
    }

    async getRates(currency, startDate, endDate) {
        // Перетворюємо 2022-01-15 на 20220115
        const start = startDate.replaceAll("-", "");
        const end = endDate.replaceAll("-", "");

        const params = new URLSearchParams({
            start: start,
            end: end,
            valcode: currency.toLowerCase(),
            sort: "exchangedate",
            order: "asc",
            json: ""
        });

        const url =
            `https://bank.gov.ua/NBU_Exchange/exchange_site?${params}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `Помилка завантаження даних: ${response.status}`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("НБУ повернув неочікуваний формат даних.");
        }

        this.rates = data.map((item) => ({
            date: item.exchangedate,
            currency: item.cc,
            rate: Number(
                item.rate_per_unit ?? item.rate / item.units
            )
        }));

        const hasInvalidRates = this.rates.some(
            (item) => !Number.isFinite(item.rate)
        );

        if (hasInvalidRates) {
            throw new Error("У відповіді НБУ є некоректні курси.");
        }

        return this.rates;
    }
}