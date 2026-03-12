

function PopupChart({ changePopupState }) {

    function handleCloseButton() {
        changePopupState(false);
    }

    return (
        <div
        id="add-modal"
        className=" fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
    >
        <div className="w-full max-w-2xl rounded-xl bg-white border border-slate-200 shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h2 className="text-sm font-semibold text-primary-dark" id="modal-title">Add</h2>
                <button
                    id="close-add-modal"
                    className="rounded px-2 py-1 text-sm border border-slate-200 hover:bg-slate-50"
                    type="button"
                    onClick={handleCloseButton}
                >
                    ✕
                </button>
            </div>

            <div className="p-4">
                <form id="pill-form" className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-[11px] font-medium text-slate-700">Name</label>
                        <input
                            id="person-name"
                            type="text"
                            required
                            className="mt-1 block w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-medium text-slate-700">Medication</label>
                        <input
                            id="med-name"
                            type="text"
                            required
                            className="mt-1 block w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-medium text-slate-700">Dosage</label>
                        <input
                            id="dosage"
                            type="text"
                            className="mt-1 block w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-medium text-slate-700">Urgency</label>
                        <div className="mt-1 flex items-center gap-2">
                            <div id="urgency-input" className="flex items-center gap-1"></div>
                            <div className="text-[11px] text-slate-500" id="urgency-label">3</div>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <div className="flex items-center justify-between">
                            <label className="block text-[11px] font-medium text-slate-700">Time</label>
                            <button
                                type="button"
                                id="add-time-btn"
                                className="inline-flex items-center gap-1 rounded border border-primary bg-primary px-2 py-1 text-[11px] text-blue-600 hover:bg-primary-dark"
                            >
                                + Add time
                            </button>
                        </div>

                        <datalist id="hh-list">
                            <option value="1"></option>
                            <option value="2"></option>
                            <option value="3"></option>
                            <option value="4"></option>
                            <option value="5"></option>
                            <option value="6"></option>
                            <option value="7"></option>
                            <option value="8"></option>
                            <option value="9"></option>
                            <option value="10"></option>
                            <option value="11"></option>
                            <option value="12"></option>
                        </datalist>


                        <datalist id="mm-list">
                            <option value="00"></option>
                        </datalist>

                        <div id="time-inputs" className="mt-2 space-y-2"></div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-[11px] font-medium text-slate-700">Notes</label>
                        <textarea
                            id="notes"
                            rows="4"
                            className="mt-1 block w-full rounded border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        ></textarea>
                    </div>

                    <div className="md:col-span-2 flex items-center justify-between pt-1">
                        <label className="inline-flex items-center gap-1.5">
                            <input
                                id="enabled"
                                type="checkbox"
                                checked
                                className="h-3.5 w-3.5 rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            <span className="text-[11px] text-body">Enable reminders</span>
                        </label>

                        <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded bg-primary px-3 py-1.5 text-[11px] font-medium text-purple-600 hover:bg-primary-dark"
                        >
                            Save
                        </button>
                    </div>

                    <p id="form-error" className="hidden md:col-span-2 text-[11px] text-red-600"></p>
                    <p id="form-success" className="hidden md:col-span-2 text-[11px] text-emerald-700"></p>
                </form>
            </div>
        </div>
    </div>
    )
}

export default PopupChart;