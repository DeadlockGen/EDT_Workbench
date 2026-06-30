export function useElectron() {
  const api = (window as any).electronAPI

  return {
    isElectron: !!api,
    file: api?.file,
    dialog: api?.dialog,
    clipboard: api?.clipboard,
    db: api?.db,
    app: api?.app
  }
}
