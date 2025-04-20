export interface ICommand<T> {
  execute(): Promise<T>
}
