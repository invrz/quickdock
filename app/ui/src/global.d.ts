interface SearchResultsInterface {
    fileName: string;
    filePath: string;
}

interface Window {
    pywebview: {
      api: {
        open_imagepicker_dialog: () => Promise<string>;
        open_file_dialog: () => Promise<string>;
        launch_application: (filePath: string, source: string) => Promise<boolean>;
        close_window: () => Promise<boolean>;
        search_files_and_folders: (querystring: string) => Promise<SearchResultsInterface[]>;
      };
    };
  }
  