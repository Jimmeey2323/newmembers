const excludedMemberIds = [
    15338497, 16288193, 15119005, 1558934, 15337432, 15343252, 15975745, 15343999, 1342000,
    15300776, 15341847, 15339393, 15119002, 15341359, 15338258, 15337832, 15338313, 15337323,
    16098069, 15343486, 15336512, 15343712, 16288189, 15338496, 15337329, 15340788, 15975071,
    15931331, 15913204, 15913221, 16256662, 15341284, 15339006, 1342000, 1342012, 17611091, 18002802, 17962795, 17441424, 17435973, 17128715, 17662843, 17715555, 17611091, 17080950
];

const excludedMembershipTypes = [
    'Studio Private Class',
    'Studio 3 Month Unlimited Membership',
    'Studio 12 Class Package',
    'Studio 8 Class Package',
    'Studio 1 Month Unlimited Membership',
    'Studio 2 Week Unlimited Membership',
    'Studio Single class',
    'Studio Annual Unlimited Membership',
    'Studio 2 Week Unlimited',
    'Studio 4 Class Package',
    'Virtual Private Class',
    'Studio 6 Month Unlimited Membership',
    'Studio 20 Single Class Pack',
    'Studio 10 Single Class Pack',
    'Studio Happy Hour Private',
    'Studio FLEX 4 Class',
    'pay-later',
    'Studio Staff/Family Class',
    'Studio 8 Class Package',
    'Studio 12 Class Package',
    'Studio 2 Week Unlimited',
    'Studio 20 Single Class Pack',
    'Studio 3 Month Unlimited Membership',
    'Studio 1 Month Unlimited Membership',
    'Studio Single Class',
    'Studio Annual Unlimited Membership',
    'Studio Newcomers 2 Week Unlimited Membership',
    'Studio 4 Class Package',
    'V\'Day Special: Shared Studio 8 Class Package '
];

const endpoints = {
    New: [
        'https://reports-api.momence.com/host/13752/reports/new-visitors?timeZone=Asia%2FKolkata&day=2023-09-24&startDate=2023-07-01T18:30:00.000Z&endDate=2025-12-31T18:29:00.000Z',
        'https://reports-api.momence.com/host/33905/reports/new-visitors?timeZone=Asia%2FKolkata&day=2023-09-24&startDate=2023-07-01T18:30:00.000Z&endDate=2025-12-31T18:29:00.000Z'
    ]
};

const authenticateAndGetCookie = async () => {
    const loginHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    const loginPayload = {
        email: 'jimmeey@physique57india.com',
        password: 'Jimmeey@123'
    };

const loginResponse = await fetch('https://api.momence.com/auth/login', {
        method: 'POST',
        headers: loginHeaders,
        body: JSON.stringify(loginPayload)
    });

    if (loginResponse.status !== 200) {
        console.log('Authentication failed.');
        return null;
    }

    const cookies = loginResponse.headers.get('Set-Cookie');
    return cookies;
};

const fetchDataFromApi = async (apiUrl, cookie) => {
    const dataHeaders = {
        'Accept': 'application/json',
        'Cookie': cookie
    };

    const options = {
        method: 'GET',
        headers: dataHeaders
    };

    const response = await fetch(apiUrl, options);

    if (response.status !== 200) {
        console.log('Fetching data failed.');
        return null;
    }

    return await response.json();
};

const generateTable = (headers, data) => {
    const table = document.getElementById('data-table');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    // Generate table headers
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Generate table data
    data.forEach(item => {
        const row = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = item[header];
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
};

const main = async () => {
    const cookie = await authenticateAndGetCookie();
    if (!cookie) return;

    const data = [];

    for (const sheetName in endpoints) {
        const dataUrls = endpoints[sheetName];

        for (const dataUrl of dataUrls) {
            const responseData = await fetchDataFromApi(dataUrl, cookie);
            if (!responseData) continue;

            const filteredItems = responseData.items.filter(item => {
                return !(excludedMemberIds.includes(item.memberId) ||
                    excludedMembershipTypes.includes(item.membershipUsed) ||
                    item.paymentMethod === "pay-later");
            });

            data.push(...filteredItems);
        }
    }

    // Extract unique headers from the data
    const headers = [...new Set(data.flatMap(item => Object.keys(item)))]
        .sort((a, b) => a.localeCompare(b));

    generateTable(headers, data);
};

main();
