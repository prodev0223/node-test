import Concurrently from './concurrently';

var counter = 0, numberOfTasks = 0
var concur

var doTask = (taskName) => {
    var begin = Date.now();
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            var end = Date.now();
            var timeSpent = (end - begin) + "ms";
            console.log(`\x1b[36m [TASK] FINISHED: ${taskName} in ${timeSpent}\x1b[0m`);

            // make success or fail results randomly to show performance
            if (Math.random() < 0.3) {
                reject("Run Time Error")
            }else{
                resolve(true);
            }
        }, (Math.random() * 5000));
    });
}

async function manageConcurrency(taskList){
	taskList.map((taskName) =>
		concur.task(async () => {
			console.log(`[EXE] Concurrency: ${concur.tasksActiveCount} of ${concur.tasksLimit}`)
			console.log(`[EXE] Task count ${++counter} of ${numberOfTasks}`)
			console.log(`\x1b[2m [TASK] STARTING: ${taskName}\x1b[0m`);
			try{
				await doTask(taskName);
			} catch(e){
				console.log(e)
			} finally{

			}
		}),
  	);
}

async function init() {
    counter = 0
    numberOfTasks = 20;
	const concurrencyMax = 4;

	concur = new Concurrently(concurrencyMax)
    const taskList = [...Array(numberOfTasks)].map(() =>
        [...Array(~~(Math.random() * 10 + 3))].map(() =>
            String.fromCharCode(Math.random() * (123 - 97) + 97)
        ).join('')
    )

    console.log("[init] Concurrency Algo Testing...")
    console.log("[init] Tasks to process: ", taskList.length)
    console.log("[init] Task list: " + taskList)
    console.log("[init] Maximum Concurrency: ", concurrencyMax, "\n")

    await manageConcurrency(taskList);
}

init()