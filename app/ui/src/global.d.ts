interface Window {
    pywebview: {
      api: {
        open_file_dialog: () => Promise<string>;
        launch_application: (filePath: string) => Promise<boolean>;
      };
    };
  }
  