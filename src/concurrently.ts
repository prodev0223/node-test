class Concurrently<T = any> {
  private tasksQueue: (() => Promise<T>)[] = [];
  private tasksActiveCount: number = 0;
  private tasksLimit: number;
  private EVEN: number = 5;
  private ODD: number = 3;
  
  public constructor(tasksLimit: number) {
    if (tasksLimit < 0) {
      throw new Error('Limit cant be lower than 0.');
    }

    this.tasksLimit = tasksLimit;
  }

  private getNewLimit() {
	const d = new Date()
	let minutes = d.getMinutes()
    return (minutes % 2 == 0) ? this.EVEN : this.ODD
  }

  private changeTasksLimit() {
	let newLimit = this.getNewLimit()
	if(this.tasksLimit != newLimit){
		console.log(`**** changing concurrency to ${newLimit} ****`)
		this.tasksLimit = newLimit
	}
  }

  private registerTask(handler) {
    this.tasksQueue = [...this.tasksQueue, handler];
    this.executeTasks();
  }

  private executeTasks() {
    while (this.tasksQueue.length && this.tasksActiveCount < this.tasksLimit) {
      const task = this.tasksQueue[0];
      this.tasksQueue = this.tasksQueue.slice(1);
      this.tasksActiveCount += 1;
      task()
        .then((result) => {
          this.tasksActiveCount -= 1;
          this.executeTasks();
          this.changeTasksLimit()
          return result;
        })
        .catch((err) => {
          this.tasksActiveCount -= 1;
          this.executeTasks();
          this.changeTasksLimit()
          throw err;
        });
    }
  }

  public task(handler: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) =>
      this.registerTask(() =>
        handler()
          .then(resolve)
          .catch(reject),
      ),
    );
  }
}

export default Concurrently;
