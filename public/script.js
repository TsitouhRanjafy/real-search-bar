const paragraphe = document.getElementById("p");
const btn_test = document.getElementById("btn_test");
const btn_health = document.getElementById("btn_health");

btn_test.addEventListener('click' , async () => {
    const pendingTest = await fetch("/test", {
        method: "GET", 
        headers: {
            content: "application/json"
        }
    })

    const test = await pendingTest.json();

    console.log(test);
})


btn_health.addEventListener('click', async (e) => {
    const pendingHealthy = await fetch("/health", {
        method: "GET", 
        headers: {
            content: "application/json"
        }
    })

    const healthy = await pendingHealthy.json();

    console.log(healthy);
})
