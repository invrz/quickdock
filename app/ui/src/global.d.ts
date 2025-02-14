interface Window {
    pywebview: {
      api: {
        open_imagepicker_dialog: () => Promise<string>;
        open_file_dialog: () => Promise<string>;
        launch_application: (filePath: string) => Promise<boolean>;
      };
    };
  }
  