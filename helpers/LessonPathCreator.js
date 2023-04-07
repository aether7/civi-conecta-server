class LessonPathCreator {
  constructor(folderResult) {
    this.folder = folderResult;
  }

  getLessonPath() {
    const subfolder = this._getSubfolder();
    const lessonNumber = String(this.folder.lesson_number ?? 1).padStart(2, '0');
    return `${this.folder.alias}/${subfolder}/clase${lessonNumber}`;
  }

  _getSubfolder() {
    if (this.folder.unit_number) {
      const unitNumber = String(this.folder.unit_number).padStart(2, '0');
      return `unidad${unitNumber}`;
    }

    const eventNumber = String(this.folder.event_number).padStart(2, '0');
    return `evento${eventNumber}`;
  }
}

module.exports = LessonPathCreator;
