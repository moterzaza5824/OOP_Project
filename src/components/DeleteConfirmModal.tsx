type DeleteConfirmModalProps = {
  recipeName: string
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteConfirmModal({
  recipeName,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <div
      className="delete-modal__backdrop"
      onClick={onCancel}
    >
      <section
        className="delete-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="delete-modal__icon" aria-hidden="true">
          !
        </div>

        <div className="delete-modal__content">
          <h2 id="delete-modal-title">
            ยืนยันการลบสูตร
          </h2>

          <p id="delete-modal-description">
            คุณต้องการลบสูตร “{recipeName}” ใช่หรือไม่?
          </p>

          <p className="delete-modal__warning">
            เมื่อลบแล้วจะไม่สามารถเรียกคืนได้
          </p>
        </div>

        <div className="delete-modal__actions">
          <button
            type="button"
            className="delete-modal__cancel"
            autoFocus
            onClick={onCancel}
          >
            ยกเลิก
          </button>

          <button
            type="button"
            className="delete-modal__confirm"
            onClick={onConfirm}
          >
            ลบสูตร
          </button>
        </div>
      </section>
    </div>
  )
}