"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePermitHtml = generatePermitHtml;
var path_1 = require("path");
var image_utils_1 = require("./image-utils");
function generatePermitHtml(data) {
    var imgEyeProtection = (0, image_utils_1.getBase64Image)((0, path_1.join)(process.cwd(), 'src/images/safetyIcons/Eyeprotection.png'));
    var imgFallProtection = (0, image_utils_1.getBase64Image)((0, path_1.join)(process.cwd(), 'src/images/safetyIcons/Fallprotection.png'));
    var imgHearingProtection = (0, image_utils_1.getBase64Image)((0, path_1.join)(process.cwd(), 'src/images/safetyIcons/Hearingprotection.png'));
    var imgRespiratoryProtection = (0, image_utils_1.getBase64Image)((0, path_1.join)(process.cwd(), 'src/images/safetyIcons/Respiratoryprotection.png'));
    var imgHotWorks = (0, image_utils_1.getBase64Image)((0, path_1.join)(process.cwd(), 'src/images/logos/HotWorks.png'));
    var imgElectricalSystems = (0, image_utils_1.getBase64Image)((0, path_1.join)(process.cwd(), 'src/images/logos/ElectricalSystems.png'));
    var imgSubstanceChemical = (0, image_utils_1.getBase64Image)((0, path_1.join)(process.cwd(), 'src/images/logos/substanceChemical.png'));
    var imgTestingEquipment = (0, image_utils_1.getBase64Image)((0, path_1.join)(process.cwd(), 'src/images/logos/testingequipment.png'));
    var imgWorkingAtHight = (0, image_utils_1.getBase64Image)((0, path_1.join)(process.cwd(), 'src/images/logos/WorkingAtHight.png'));
    var imgConfinedSpace = (0, image_utils_1.getBase64Image)((0, path_1.join)(process.cwd(), 'src/images/logos/ConfinedSpace.png'));
    var imgExcavationWorks = (0, image_utils_1.getBase64Image)((0, path_1.join)(process.cwd(), 'src/images/logos/ExcavationWorks.png'));
    var imgCranesLifting = (0, image_utils_1.getBase64Image)((0, path_1.join)(process.cwd(), 'src/images/logos/Craneslifting.png'));
    var imgElectricalWorks = (0, image_utils_1.getBase64Image)((0, path_1.join)(process.cwd(), 'src/images/logos/electrical_works.png'));
    var imgMechanicalWorks = (0, image_utils_1.getBase64Image)((0, path_1.join)(process.cwd(), 'src/images/logos/mechanical1.png'));
    // Format Helper for Date
    var formatDateOnly = function (dateStr) {
        if (!dateStr)
            return '-';
        try {
            var d = new Date(dateStr);
            if (isNaN(d.getTime()))
                return String(dateStr);
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return "".concat(String(d.getDate()).padStart(2, '0'), "-").concat(months[d.getMonth()], "-").concat(d.getFullYear());
        }
        catch (_a) {
            return String(dateStr);
        }
    };
    // Format Helper for Room names / Zone names
    var formatRooms = function (roomsStr) {
        if (!roomsStr)
            return '-';
        return String(roomsStr).split(',').map(function (r) { return r.trim(); }).filter(Boolean).join(', ');
    };
    // Format Helper for Date + Time
    var formatDateTime = function (dateStr) {
        if (!dateStr)
            return '-';
        try {
            var d = new Date(dateStr);
            if (isNaN(d.getTime()))
                return String(dateStr);
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var day = String(d.getDate()).padStart(2, '0');
            var month = months[d.getMonth()];
            var year = d.getFullYear();
            var hours = d.getHours();
            var minutes = String(d.getMinutes()).padStart(2, '0');
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            return "".concat(day, "-").concat(month, "-").concat(year, " ").concat(String(hours).padStart(2, '0'), ":").concat(minutes, " ").concat(ampm);
        }
        catch (_a) {
            return String(dateStr);
        }
    };
    var formatTimeOnly = function (timeStr) {
        if (!timeStr)
            return '-';
        try {
            if (typeof timeStr === 'string' && timeStr.includes(':')) {
                var parts = timeStr.split(':');
                var hours = parseInt(parts[0], 10);
                var minutes = parts[1];
                var ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12;
                return "".concat(String(hours).padStart(2, '0'), ":").concat(minutes, " ").concat(ampm);
            }
            var d = new Date(timeStr);
            if (!isNaN(d.getTime())) {
                var hours = d.getHours();
                var minutes = String(d.getMinutes()).padStart(2, '0');
                var ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12;
                return "".concat(String(hours).padStart(2, '0'), ":").concat(minutes, " ").concat(ampm);
            }
            return String(timeStr);
        }
        catch (_a) {
            return String(timeStr);
        }
    };
    var getStatusText = function () {
        if (data.cancel_reason === 'Permit not opened so system cancelled automatically') {
            return 'Auto-Cancelled';
        }
        return data.Request_status || 'Draft';
    };
    var getFireImageUrl = function (imageVal) {
        if (!imageVal)
            return '';
        if (imageVal.startsWith('data:')) {
            return imageVal;
        }
        if (/^[A-Za-z0-9+/=]+$/.test(imageVal) && imageVal.length > 100) {
            return "data:image/png;base64,".concat(imageVal);
        }
        if (imageVal.startsWith('http://') || imageVal.startsWith('https://')) {
            return imageVal;
        }
        var filename = imageVal.split('/').pop() || imageVal;
        return "/requests/".concat(filename);
    };
    var getCheckImageSrc = function (imageVal) {
        if (!imageVal)
            return '';
        if (imageVal.startsWith('data:')) {
            return imageVal;
        }
        if (/^[A-Za-z0-9+/=]+$/.test(imageVal) && imageVal.length > 100) {
            return "data:image/png;base64,".concat(imageVal);
        }
        if (imageVal.startsWith('http://') || imageVal.startsWith('https://')) {
            return imageVal;
        }
        var filename = imageVal.split('/').pop() || imageVal;
        return "/requests/".concat(filename);
    };
    // Helper arrays for checklist loops
    var generalSafetyQuestions = [
        { id: 'affecting_other_contractors', text: 'Can you confirm that your work not affecting with other contractors working in this area before starting the work?' },
        { id: 'other_conditions', text: 'Are there other conditions that must be taken into account during the work? If Yes, note in "Other conditions"' },
        { id: 'lighting_begin_work', text: 'Can you confirm that there will be enough work lighting to begin the work?' },
        { id: 'specific_risks', text: 'Have the team been informed about the specific risks based on task? (RAMS/Toolbox talk etc.)' },
        { id: 'environment_ensured', text: 'Is the work environment safely ensured? Have the necessary warning signs been placed?' },
        { id: 'course_of_action', text: 'Have the team been informed about the course of action in any emergency situation?' }
    ];
    var hotWorkQuestions = [
        { id: 'tasks_in_progress_in_the_area', text: 'Are there other tasks in progress in the area?' },
        { id: 'lighting_sufficiently', text: 'Have you considered any alternative methods to the hot work method? (Ex.: replacing the angle grinder with hydraulic cutters or using prefab electronic orders for measurement)' },
        { id: 'spesific_risks_based_on_task', text: 'Have the team been informed about the specific risks based on task? (RAMS/Toolbox talk etc.)' },
        { id: 'work_environment_safety_ensured', text: 'Is the work environment safely ensured? Have the necessary warning signs been placed?' },
        { id: 'course_of_action_in_emergencies', text: 'Have the team been informed about the course of action in emergencies?' },
        { id: 'fire_watch_establish', text: 'Should a fire watch be established?' },
        { id: 'combustible_material', text: 'Can you confirm that the flammable material are removed from the work area?' },
        { id: 'safety_measures', text: 'Should safety measures implemented to stop sparks from splattering on a flooring or other surfaces?' },
        { id: 'extinguishers_and_fire_blanket', text: 'Are fire extinguishers and fire blanket ready for use in the area?' }
    ];
    var weldingQuestions = [
        { id: 'heat_treatment', text: 'The people who will do heat treatment, had welder certificates?' },
        { id: 'air_extraction_be_established', text: 'Should air extraction be established? (Welding fumes directly led to open air)' }
    ];
    var electricalQuestions = [
        { id: 'responsible_for_the_informed', text: 'Is the responsible for the area informed?' },
        { id: 'de_energized', text: 'Check if the board is de-energized - is it de-energized?' },
        { id: 'do_risk_assessment', text: 'Do you have risk assessment done RAMS?' },
        { id: 'if_no_loto', text: "Secure the area against reconnection using LOTO (Lock-out/Tag-out) with at least a craftsman's padlock." },
        { id: 'electricity_have_isulation', text: 'Do appliances/devices that run on electricity have insulation?' }
    ];
    var chemicalQuestions = [
        { id: 'relevant_mal', text: 'Relevant MAL-codes and safety datasheets for hazardous medias have been presented?' },
        { id: 'msds', text: 'Is MSDS (Material Safety Data Sheet) submitted?' },
        { id: 'equipment_taken_account', text: 'Has the use of protective equipment been taken into account - and are they present?' },
        { id: 'ventilation', text: 'Has the use of ventilation been taken into account?' },
        { id: 'hazardaus_substances', text: 'Will the hazardous substances affect people outside the working area? (fumes)' },
        { id: 'storage_and_disposal', text: 'Are there means for safe storage and disposal? Is it mapped on the site plan (in case of large amount or long term storage)' },
        { id: 'reachable_case', text: 'Are the spill kits in place and reachable in case of a leak or spill?' },
        { id: 'checical_risk_assessment', text: 'Is RAMS (Risk assessment and Method statement) covering chemicals risk assessment for working with the substance?' }
    ];
    var pressureQuestions = [
        { id: 'line_walk', text: 'Linewalk of the pipework/equipment done?' },
        { id: 'pressure_test_coordinated', text: 'Pressure test is coordinated with NNE C&Q?' },
        { id: 'pipework_mic', text: 'Is the pipework/equipment MIC? (Mechanical Installation Complete)?' },
        { id: 'loto_plan_attached', text: 'LOTO plan attached to the work permit?' },
        { id: 'exclusion_zone_calculated', text: 'Is the exclusion zone calculated and layout attached to work permit?' },
        { id: 'pneumatic_hydrostatic', text: 'Pneumatic test?' },
        { id: 'pressure_of_the_test', text: 'Hydrostatic test?' },
        { id: 'safety_valves_calibrated', text: 'Safety Valves are calibrated and attached to the Pressure testing rig?' }
    ];
    var heightQuestions = [
        { id: 'segragated_demarkated', text: 'Has the working area been segregated or demarcated with hand barriers?' },
        { id: 'lanyard_attachments', text: 'Are suitable anchor points in place for lanyard attachments?' },
        { id: 'rescue_plan', text: 'In case of emergency is there a rescue plan in place?' },
        { id: 'avoid_hazards', text: 'Has the work been planned and coordinated to avoid hazards like (falling objects/materials onto other workers, interference between the machines etc.)' },
        { id: 'height_training', text: 'Has the team had certified working at height training?' },
        { id: 'supervision', text: "Will this work be carried out by, and under the supervision of personnel who have received 'Working at Height' training?" },
        { id: 'shock_absorbing', text: 'Full body harness with fall-preventing system deployed & twin lanyard provided?' },
        { id: 'height_equipments', text: 'Are the working at height equipments (Safety harness and lanyard) inspected and suitable to carry out the task?' },
        { id: 'vertical_life', text: 'Horizontal or vertical life line systems in place?' },
        { id: 'secured_falling', text: 'Are all tools secured from falling from height?' },
        { id: 'dropped_objects', text: 'Have protective measures for dropped objects been established? Eg. (lanyards, demarcated working area, nets)?' },
        { id: 'safe_acces', text: 'Has proper and safe access and egress been ensured?' },
        { id: 'weather_acceptable', text: 'Are the weather conditions acceptable?' }
    ];
    var confinedQuestions = [
        { id: 'vapours_gases', text: 'Is the tank/container cleaned so that the task can take place without risk from vapours, gases etc.?' },
        { id: 'lel_measurement', text: 'Are oxygen measurement and LEL measurement done before starting the work?' },
        { id: 'all_equipment', text: 'Are the container and all equipment on the container, including agitator properly secured?' },
        { id: 'exit_conditions', text: 'Are there safe entry and exit conditions? (e.g. ladder)' },
        { id: 'communication_emergency', text: 'Are means of communication for emergency rescue determined? (Siren, radio or telephone options)' },
        { id: 'rescue_equipments', text: 'Are rescue equipments for use in place and ready?' },
        { id: 'space_ventilation', text: 'Are space and ventilation adequate?' },
        { id: 'oxygen_meter', text: 'Is an oxygen meter provided for the work?' }
    ];
    var excavationQuestions = [
        { id: 'excavation_segregated', text: 'Is the excavation area segregated (1 meter from edge with hard barriers or 2 meters with soft barriers) before the work begins?' },
        { id: 'nn_standards', text: 'Has the digging permit been obtained in accordance with Danish regulations and NN standards?' },
        { id: 'excavation_shoring', text: 'Does excavation require shoring?' },
        { id: 'danish_regulation', text: 'Is the sloping correct in relation to the depth of the dig as per Danish regulations?' },
        { id: 'safe_access_and_egress', text: 'Have proper and safe access and egress been provided?' },
        { id: 'correctly_sloped', text: 'Are correctly positioned ladders or correctly sloped stairways accessible?' },
        { id: 'inspection_dates', text: 'Does all machines have valid inspection dates?' },
        { id: 'marked_drawings', text: 'Have clearly marked drawings been submitted?' },
        { id: 'underground_areas_cleared', text: 'Are the underground areas cleared from all electrical, piping and other services?' }
    ];
    var liftingQuestions = [
        { id: 'appointed_person', text: 'Is there an appointed person in charge of the lifting/crane operation?' },
        { id: 'vendor_supplier', text: 'Are the details of load (dimensions, SWL) and the loading/unloading requirements provided from vendor or supplier?' },
        { id: 'lift_plan', text: 'Is lift plan submitted?' },
        { id: 'supplied_and_inspected', text: 'Has the correct crane/lifting equipment as stated in the lift plan been supplied and inspected?' },
        { id: 'legal_required_certificates', text: 'Do the crane operators have the legal required certificates?' },
        { id: 'prapared_lifting', text: 'Is laydown area suitable and prepared for lifting?' },
        { id: 'lifting_task_fenced', text: 'Is the entire area of the lifting task fenced off?' },
        { id: 'overhead_risks', text: 'Have all overhead risks (cables, adjacent structures etc) been identified and suitable precautions implemented?' }
    ];
    var energisingElecQuestions = [
        { id: 'responsible_for_the_area', text: 'Is the responsible for the area informed?' },
        { id: 'risk_assessment_done', text: 'Do you have a risk assessment done?' },
        { id: 'barriers_signage', text: 'Barriers & Signage in place?' },
        { id: 'arc_flash', text: 'Arc flash boundary and PPE evaluated?' },
        { id: 'energized_been_tested', text: 'Have all the cables that need to be energized been tested?' },
        { id: 'punches_been_closed', text: 'Have all punches been closed?' },
        { id: 'toct_checklist', text: 'Is Electrical Checklist completed?' },
        { id: 'informed_aligned', text: 'Have you informed and aligned with EL LOTO team and provided them with an energisation request form?' }
    ];
    var isolatingElecQuestions = [
        { id: 'isolating_resposible', text: 'Is the responsible for the area informed?' },
        { id: 'isolating_risk_assessment', text: 'Has a Risk Assessment been completed?' },
        { id: 'cq_informed', text: 'Have C&Q LOTO been informed and tasks co-ordinated for shutdown work?' },
        { id: 'cq_provided', text: 'Have C&Q LOTO been provided marked up single line diagrams/electrical drawings?' },
        { id: 'de_energisation_request', text: 'Has a De-Energisation Request form and supporting documentation been provided to C&Q LOTO?' },
        { id: 'ppe_prepared', text: 'Are all barriers, signage and PPE prepared for the task?' },
        { id: 'absence_of_voltage', text: 'Has absence of voltage been verified and proven dead?' },
        { id: 'stored_energy', text: 'Has stored energy been discharged?' },
        { id: 'backup_power', text: 'Have any secondary or back up power supplies been confirmed and accounted for?' }
    ];
    var workingNearLiveQuestions = [
        { id: 'unavoidable', text: 'Live work is unavoidable and justified?' },
        { id: 'reasonably_practicable', text: 'De-energisation is not reasonably practicable?' },
        { id: 'work_authorised', text: 'Live work authorised by electrical responsible person?' },
        { id: 'working_risk_assessment', text: 'Risk assessment has been completed?' },
        { id: 'working_arc_boundary', text: 'Arc flash boundary and PPE evaluated?' },
        { id: 'working_barriers', text: 'Barriers and Signage in place?' },
        { id: 'insulated_tools', text: 'Insulated tools and approved test equipment to be used?' },
        { id: 'event_of_emergency', text: 'Work will always be carried out with a second person to assist in the event of an emergency?' }
    ];
    var mechanicalQuestions = [
        { id: 'performed_approved', text: 'Pressure test performed and approved?' },
        { id: 'flushing_approved', text: 'Flushing approved?' },
        { id: 'mc_approved', text: 'MC approved?' },
        { id: 'visual_inspection', text: 'Walkdown with Visual inspection performed?' },
        { id: 'loto_plan_approved', text: 'LOTO plan approved and installed by LOTO officer?' },
        { id: 'follow_media_code', text: 'Ensure Safety Valves follow Media Code?' },
        { id: 'cq_safety_signs', text: 'C&Q Safety signs are in place?' }
    ];
    var renderCheckRow = function (question, val) {
        var isYes = val !== undefined && val !== null && Number(val) === 1;
        var isNo = val !== undefined && val !== null && Number(val) === 0;
        var isNa = val !== undefined && val !== null && Number(val) === 2;
        return "\n      <tr>\n        <td>".concat(question, "</td>\n        <td class=\"check-cell\">").concat(isYes ? '<span class="check-indicator check-yes">✓</span>' : '-', "</td>\n        <td class=\"check-cell\">").concat(isNo ? '<span class="check-indicator check-no">✓</span>' : '-', "</td>\n        <td class=\"check-cell\">").concat(isNa ? '<span class="check-indicator check-na">✓</span>' : '-', "</td>\n      </tr>\n    ");
    };
    var getRiskLevel = function () {
        if (Number(data.high_risk_hotwork) === 1)
            return 'High';
        if (Number(data.low_risk_hotwork) === 1)
            return 'Low';
        return 'High';
    };
    var getDuration = function () {
        if (!data.Start_Time || !data.End_Time)
            return '-';
        try {
            var parseTime = function (t) {
                var parts = t.split(':');
                var h = parseInt(parts[0], 10);
                var m = parseInt(parts[1], 10) || 0;
                return h + m / 60;
            };
            var start = parseTime(data.Start_Time);
            var end = parseTime(data.End_Time);
            if (!isNaN(start) && !isNaN(end)) {
                var diff = end - start;
                if (diff < 0)
                    diff += 24; // overnight
                return "".concat(Number(diff.toFixed(2)), " hrs");
            }
        }
        catch (_a) {
            // ignore
        }
        return '8 hrs';
    };
    // Map status to dynamic steps list based on logs history
    var requestStatus = getStatusText();
    var logsList = (data.logs || []).filter(function (l) { return l.requestType && l.requestType.trim() !== 'Edited'; });
    var findLogByType = function (types) {
        return logsList.find(function (l) {
            return types.includes(l.requestType.toLowerCase().trim());
        });
    };
    var logDraft = findLogByType(['draft', 'created']);
    var logHold = findLogByType(['hold']);
    var logPreApproved = findLogByType(['pre-approved', 'pre_approved']);
    var logApproved = findLogByType(['approved']);
    var logOpened = findLogByType(['opened', 'open', 'opened/active']);
    var logClosed = findLogByType(['closed']);
    var logRejected = findLogByType(['rejected', 'reject']);
    var logCancelled = findLogByType(['cancelled', 'cancel']);
    // Build the list of steps for the tracking bar
    var trackingSteps = [];
    // Step 1: Draft or Hold
    var firstStepLabel = logDraft ? 'Draft' : 'Hold';
    var firstStepLog = logDraft || logHold;
    trackingSteps.push({
        label: firstStepLabel,
        log: firstStepLog,
        iconType: firstStepLabel.toLowerCase(),
    });
    // Check Pre-Approved
    if (logPreApproved || requestStatus.toLowerCase() === 'pre-approved') {
        trackingSteps.push({
            label: 'Pre-Approved',
            log: logPreApproved,
            iconType: 'pre-approved',
        });
    }
    // Branch for Rejected vs Approved
    if (logRejected || requestStatus.toLowerCase() === 'rejected') {
        trackingSteps.push({
            label: 'Rejected',
            log: logRejected,
            iconType: 'rejected',
        });
    }
    else {
        // Approved
        trackingSteps.push({
            label: 'Approved',
            log: logApproved,
            iconType: 'approved',
        });
        // Check if Cancelled after approved
        if (logCancelled || requestStatus.toLowerCase() === 'cancelled') {
            trackingSteps.push({
                label: 'Cancelled',
                log: logCancelled,
                iconType: 'cancelled',
            });
        }
        else {
            // Standard flow: Opened -> Closed
            trackingSteps.push({
                label: 'Opened',
                log: logOpened,
                iconType: 'opened',
            });
            trackingSteps.push({
                label: 'Closed',
                log: logClosed,
                iconType: 'closed',
            });
        }
    }
    // Find active step index: the last step in the list that has a log record
    var activeStepIndex = 0;
    for (var i = 0; i < trackingSteps.length; i++) {
        if (trackingSteps[i].log) {
            activeStepIndex = i;
        }
    }
    // Percentage of progress line
    var progressPercent = trackingSteps.length > 1
        ? (activeStepIndex / (trackingSteps.length - 1)) * 100
        : 0;
    var getStepClass = function (stepIdx) {
        var step = trackingSteps[stepIdx];
        var baseClass = 'step-upcoming';
        if (activeStepIndex === stepIdx) {
            baseClass = 'step-active';
        }
        else if (activeStepIndex > stepIdx) {
            baseClass = 'step-completed';
        }
        if (step.label === 'Rejected') {
            return "".concat(baseClass, " step-rejected");
        }
        if (step.label === 'Cancelled') {
            return "".concat(baseClass, " step-cancelled");
        }
        return baseClass;
    };
    var toSvgDataUrl = function (svgContent) {
        var base64 = Buffer.from(svgContent.trim()).toString('base64');
        return "data:image/svg+xml;base64,".concat(base64);
    };
    var locationPinDataUrl = toSvgDataUrl("\n    <svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"#64748b\" stroke-width=\"2\" width=\"14\" height=\"14\">\n      <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z\" />\n      <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M15 11a3 3 0 11-6 0 3 3 0 016 0z\" />\n    </svg>\n  ");
    var statusIconDataUrl = toSvgDataUrl("\n    <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"#2563eb\" width=\"20\" height=\"20\">\n      <path fill-rule=\"evenodd\" d=\"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z\" clip-rule=\"evenodd\" />\n    </svg>\n  ");
    var companyIconDataUrl = toSvgDataUrl("\n    <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"#ef4444\" width=\"20\" height=\"20\">\n      <path fill-rule=\"evenodd\" d=\"M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-3a1 1 0 00-1-1H7a1 1 0 00-1 1v3a1 1 0 01-1 1H3a1 1 0 110-2V4zm2 2h4v2H6V6zm10 4h-4v2h4v-2z\" clip-rule=\"evenodd\" />\n    </svg>\n  ");
    var calendarIconDataUrl = toSvgDataUrl("\n    <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"#f97316\" width=\"20\" height=\"20\">\n      <path fill-rule=\"evenodd\" d=\"M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z\" clip-rule=\"evenodd\" />\n    </svg>\n  ");
    var workersIconDataUrl = toSvgDataUrl("\n    <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"#16a34a\" width=\"20\" height=\"20\">\n      <path d=\"M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z\" />\n    </svg>\n  ");
    var durationIconDataUrl = toSvgDataUrl("\n    <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"#64748b\" width=\"20\" height=\"20\">\n      <path fill-rule=\"evenodd\" d=\"M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z\" clip-rule=\"evenodd\" />\n    </svg>\n  ");
    var getCardHeaderIcon = function (name) {
        var svgContent = '';
        if (name === 'location') {
            svgContent = "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"#475569\" stroke-width=\"2\" width=\"20\" height=\"20\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z\" /><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M15 11a3 3 0 11-6 0 3 3 0 016 0z\" /></svg>";
        }
        else if (name === 'tools') {
            svgContent = "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"#475569\" stroke-width=\"2\" width=\"20\" height=\"20\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z\" /><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\" /></svg>";
        }
        else if (name === 'safety') {
            svgContent = "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"#475569\" stroke-width=\"2\" width=\"20\" height=\"20\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z\" /></svg>";
        }
        else if (name === 'users') {
            svgContent = "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"#475569\" stroke-width=\"2\" width=\"20\" height=\"20\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z\" /></svg>";
        }
        else if (name === 'hazards') {
            svgContent = "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"#dc2626\" stroke-width=\"2\" width=\"20\" height=\"20\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z\" /></svg>";
        }
        else if (name === 'check') {
            svgContent = "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"#475569\" stroke-width=\"2\" width=\"20\" height=\"20\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z\" /></svg>";
        }
        else if (name === 'confirmations') {
            svgContent = "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"#475569\" stroke-width=\"2\" width=\"20\" height=\"20\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2\" /></svg>";
        }
        else if (name === 'attachments') {
            svgContent = "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"#475569\" stroke-width=\"2\" width=\"20\" height=\"20\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M15.172 7l-6.586 6.586a2 2 0 11-2.828-2.828l6.414-6.586a4 4 0 015.656 5.656l-6.415 6.585a6 6 0 11-8.486-8.486L10.5 10\" /></svg>";
        }
        else if (name === 'metadata') {
            svgContent = "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"#475569\" stroke-width=\"2\" width=\"20\" height=\"20\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z\" /></svg>";
        }
        else if (name === 'hra-main') {
            svgContent = "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"#475569\" stroke-width=\"2\" width=\"24\" height=\"24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2\" /></svg>";
        }
        else if (name === 'no-hra-alert') {
            svgContent = "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"#94a3b8\" stroke-width=\"2\" width=\"48\" height=\"48\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z\" /></svg>";
        }
        return "\n      <img src=\"".concat(toSvgDataUrl(svgContent), "\" style=\"width: ").concat(name === 'hra-main' ? '24px' : '20px', "; height: ").concat(name === 'hra-main' ? '24px' : '20px', "; display: block;\" />\n    ");
    };
    var getStepIconSvg = function (iconType, color) {
        switch (iconType) {
            case 'draft':
            case 'hold':
                return "\n          <svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"".concat(color, "\" stroke-width=\"2\" width=\"20\" height=\"20\">\n            <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z\" />\n          </svg>\n        ");
            case 'pre-approved':
                return "\n          <svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"".concat(color, "\" stroke-width=\"2\" width=\"20\" height=\"20\">\n            <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z\" />\n          </svg>\n        ");
            case 'approved':
                return "\n          <svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"".concat(color, "\" stroke-width=\"2\" width=\"20\" height=\"20\">\n            <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M9 12l2 2 4-4m6 2a9 9 0 11-16 0 9 9 0 0116 0z\" />\n          </svg>\n        ");
            case 'opened':
                return "\n          <svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"".concat(color, "\" stroke-width=\"2\" width=\"20\" height=\"20\">\n            <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z\" /><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M21 12a9 9 0 11-18 0 9 9 0 0118 0z\" />\n          </svg>\n        ");
            case 'closed':
                return "\n          <svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"".concat(color, "\" stroke-width=\"2\" width=\"20\" height=\"20\">\n            <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z\" />\n          </svg>\n        ");
            case 'rejected':
                return "\n          <svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"".concat(color, "\" stroke-width=\"2\" width=\"20\" height=\"20\">\n            <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z\" />\n          </svg>\n        ");
            case 'cancelled':
                return "\n          <svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"".concat(color, "\" stroke-width=\"2\" width=\"20\" height=\"20\">\n            <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636\" />\n          </svg>\n        ");
            default:
                return '';
        }
    };
    var getStepIconDataUrl = function (iconType, color) {
        var svgStr = getStepIconSvg(iconType, color);
        var base64 = Buffer.from(svgStr.trim()).toString('base64');
        return "data:image/svg+xml;base64,".concat(base64);
    };
    var getStepHtml = function (step, idx) {
        var _a;
        var metaHtml = step.log
            ? "\n        <div class=\"step-meta\" style=\"font-size: 10px; color: #64748b; margin-top: 6px; line-height: 1.3; font-weight: 500; word-break: break-all; max-width: 100px;\">\n          <div>".concat(formatDateTime(step.log.createdTime), "</div>\n          <div style=\"font-weight: 600; color: #475569; margin-top: 1px;\">By: ").concat(((_a = step.log.user) === null || _a === void 0 ? void 0 : _a.username) || "User #".concat(step.log.userId) || '', "</div>\n        </div>\n      ")
            : '';
        var iconColor = '#94a3b8';
        var isCompleted = activeStepIndex > idx;
        var isActive = activeStepIndex === idx;
        if (isCompleted) {
            iconColor = '#ffffff';
        }
        else if (isActive) {
            if (step.label === 'Rejected' || step.label === 'Cancelled') {
                iconColor = '#ffffff';
            }
            else {
                iconColor = '#2563eb';
            }
        }
        return "\n      <div class=\"stepper-step ".concat(getStepClass(idx), "\">\n        <div class=\"step-circle\">\n          <img src=\"").concat(getStepIconDataUrl(step.iconType, iconColor), "\" style=\"width: 20px; height: 20px; display: block;\" />\n        </div>\n        <div class=\"step-label\">").concat(step.label, "</div>\n        ").concat(metaHtml, "\n      </div>\n    ");
    };
    var stepperStepsHtml = trackingSteps.map(function (step, idx) { return getStepHtml(step, idx); }).join('');
    var getStageName = function () {
        if (activeStepIndex === 0)
            return 'Drafting';
        if (activeStepIndex === 1)
            return 'Review';
        if (activeStepIndex === 2)
            return 'Approval';
        if (activeStepIndex === 3)
            return 'Execution';
        if (activeStepIndex === 4)
            return 'Closed';
        return 'Execution';
    };
    var activeHazardsCount = 0;
    if (Number(data.Hot_work) === 1)
        activeHazardsCount++;
    if (Number(data.working_on_electrical_system) === 1)
        activeHazardsCount++;
    if (Number(data.working_hazardious_substen) === 1)
        activeHazardsCount++;
    if (Number(data.pressure_testing_of_equipment) === 1)
        activeHazardsCount++;
    if (Number(data.working_at_height) === 1)
        activeHazardsCount++;
    if (Number(data.working_confined_spaces) === 1)
        activeHazardsCount++;
    if (Number(data.excavation_works) === 1)
        activeHazardsCount++;
    if (Number(data.using_cranes_or_lifting) === 1)
        activeHazardsCount++;
    if (Number(data.power_on) === 1)
        activeHazardsCount++;
    if (Number(data.pressurization) === 1)
        activeHazardsCount++;
    var renderPpeCard = function (label, iconSrc, isRequired) {
        var statusText = isRequired ? 'Required' : 'N/A';
        var statusClass = isRequired ? 'ppe-status-required' : 'ppe-status-na';
        var cardClass = isRequired ? 'ppe-card-active' : 'ppe-card-inactive';
        return "\n      <div class=\"ppe-card ".concat(cardClass, "\">\n        <div class=\"ppe-badge-wrap\">\n          <span class=\"ppe-badge ").concat(statusClass, "\">").concat(statusText, "</span>\n        </div>\n        <div class=\"ppe-icon-container\">\n          ").concat(iconSrc ? "<img src=\"".concat(iconSrc, "\" class=\"ppe-icon\" alt=\"").concat(label, "\">") : '', "\n        </div>\n        <div class=\"ppe-label\">").concat(label, "</div>\n      </div>\n    ");
    };
    var renderActiveHazardCards = function () {
        var html = '';
        if (Number(data.Hot_work) === 1) {
            var riskLevelText = Number(data.high_risk_hotwork) === 1 ? 'High Risk' : 'Low Risk';
            var riskLevelClass = Number(data.high_risk_hotwork) === 1 ? 'text-danger' : 'text-success';
            html += "\n        <div class=\"active-hazard-card mb-3\">\n          <div class=\"active-hazard-header\">\n            <div class=\"active-hazard-title-wrap\">\n              <span class=\"hazard-warning-icon\">\n                <img src=\"".concat(imgHotWorks, "\" style=\"width: 24px; height: 24px; object-fit: contain; vertical-align: middle;\">\n              </span>\n              <div>\n                <div class=\"hazard-title\">Hot Work</div>\n                <div class=\"hazard-risk ").concat(riskLevelClass, "\">").concat(riskLevelText, "</div>\n              </div>\n            </div>\n            <div class=\"hazard-check-status\">\n              <span class=\"hazard-check-circle bg-green-light color-green\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"currentColor\" style=\"width: 16px; height: 16px; display: inline-block;\">\n                  <path fill-rule=\"evenodd\" d=\"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\" clip-rule=\"evenodd\" />\n                </svg>\n              </span>\n            </div>\n          </div>\n        </div>\n      ");
        }
        if (Number(data.working_on_electrical_system) === 1) {
            html += "\n        <div class=\"active-hazard-card mb-3\">\n          <div class=\"active-hazard-header\">\n            <div class=\"active-hazard-title-wrap\">\n              <span class=\"hazard-warning-icon\">\n                <img src=\"".concat(imgElectricalSystems, "\" style=\"width: 24px; height: 24px; object-fit: contain; vertical-align: middle;\">\n              </span>\n              <div>\n                <div class=\"hazard-title\">Temporary Electrical Systems</div>\n                <div class=\"hazard-risk text-warning\">Electrical Risk</div>\n              </div>\n            </div>\n            <div class=\"hazard-check-status\">\n              <span class=\"hazard-check-circle bg-green-light color-green\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"currentColor\" style=\"width: 16px; height: 16px; display: inline-block;\">\n                  <path fill-rule=\"evenodd\" d=\"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\" clip-rule=\"evenodd\" />\n                </svg>\n              </span>\n            </div>\n          </div>\n        </div>\n      ");
        }
        if (Number(data.working_hazardious_substen) === 1) {
            html += "\n        <div class=\"active-hazard-card mb-3\">\n          <div class=\"active-hazard-header\">\n            <div class=\"active-hazard-title-wrap\">\n              <span class=\"hazard-warning-icon\">\n                <img src=\"".concat(imgSubstanceChemical, "\" style=\"width: 24px; height: 24px; object-fit: contain; vertical-align: middle;\">\n              </span>\n              <div>\n                <div class=\"hazard-title\">Hazardous Substances</div>\n                <div class=\"hazard-risk text-danger\">Chemical Risk</div>\n              </div>\n            </div>\n            <div class=\"hazard-check-status\">\n              <span class=\"hazard-check-circle bg-green-light color-green\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"currentColor\" style=\"width: 16px; height: 16px; display: inline-block;\">\n                  <path fill-rule=\"evenodd\" d=\"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\" clip-rule=\"evenodd\" />\n                </svg>\n              </span>\n            </div>\n          </div>\n        </div>\n      ");
        }
        if (Number(data.working_at_height) === 1) {
            html += "\n        <div class=\"active-hazard-card mb-3\">\n          <div class=\"active-hazard-header\">\n            <div class=\"active-hazard-title-wrap\">\n              <span class=\"hazard-warning-icon\">\n                <img src=\"".concat(imgWorkingAtHight, "\" style=\"width: 24px; height: 24px; object-fit: contain; vertical-align: middle;\">\n              </span>\n              <div>\n                <div class=\"hazard-title\">Working at Height</div>\n                <div class=\"hazard-risk text-primary\">Fall Risk</div>\n              </div>\n            </div>\n            <div class=\"hazard-check-status\">\n              <span class=\"hazard-check-circle bg-green-light color-green\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"currentColor\" style=\"width: 16px; height: 16px; display: inline-block;\">\n                  <path fill-rule=\"evenodd\" d=\"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\" clip-rule=\"evenodd\" />\n                </svg>\n              </span>\n            </div>\n          </div>\n        </div>\n      ");
        }
        if (Number(data.working_confined_spaces) === 1) {
            html += "\n        <div class=\"active-hazard-card mb-3\">\n          <div class=\"active-hazard-header\">\n            <div class=\"active-hazard-title-wrap\">\n              <span class=\"hazard-warning-icon\">\n                <img src=\"".concat(imgConfinedSpace, "\" style=\"width: 24px; height: 24px; object-fit: contain; vertical-align: middle;\">\n              </span>\n              <div>\n                <div class=\"hazard-title\">Confined Space Entry</div>\n                <div class=\"hazard-risk text-warning\">Atmosphere Risk</div>\n              </div>\n            </div>\n            <div class=\"hazard-check-status\">\n              <span class=\"hazard-check-circle bg-green-light color-green\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"currentColor\" style=\"width: 16px; height: 16px; display: inline-block;\">\n                  <path fill-rule=\"evenodd\" d=\"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\" clip-rule=\"evenodd\" />\n                </svg>\n              </span>\n            </div>\n          </div>\n        </div>\n      ");
        }
        if (Number(data.pressure_testing_of_equipment) === 1) {
            html += "\n        <div class=\"active-hazard-card mb-3\">\n          <div class=\"active-hazard-header\">\n            <div class=\"active-hazard-title-wrap\">\n              <span class=\"hazard-warning-icon\">\n                <img src=\"".concat(imgTestingEquipment, "\" style=\"width: 24px; height: 24px; object-fit: contain; vertical-align: middle;\">\n              </span>\n              <div>\n                <div class=\"hazard-title\">Pressure Testing of Equipment</div>\n                <div class=\"hazard-risk text-warning\">Pressure Risk</div>\n              </div>\n            </div>\n            <div class=\"hazard-check-status\">\n              <span class=\"hazard-check-circle bg-green-light color-green\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"currentColor\" style=\"width: 16px; height: 16px; display: inline-block;\">\n                  <path fill-rule=\"evenodd\" d=\"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\" clip-rule=\"evenodd\" />\n                </svg>\n              </span>\n            </div>\n          </div>\n        </div>\n      ");
        }
        if (Number(data.excavation_works) === 1) {
            html += "\n        <div class=\"active-hazard-card mb-3\">\n          <div class=\"active-hazard-header\">\n            <div class=\"active-hazard-title-wrap\">\n              <span class=\"hazard-warning-icon\">\n                <img src=\"".concat(imgExcavationWorks, "\" style=\"width: 24px; height: 24px; object-fit: contain; vertical-align: middle;\">\n              </span>\n              <div>\n                <div class=\"hazard-title\">Excavation Works</div>\n                <div class=\"hazard-risk text-danger\">Ground Risk</div>\n              </div>\n            </div>\n            <div class=\"hazard-check-status\">\n              <span class=\"hazard-check-circle bg-green-light color-green\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"currentColor\" style=\"width: 16px; height: 16px; display: inline-block;\">\n                  <path fill-rule=\"evenodd\" d=\"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\" clip-rule=\"evenodd\" />\n                </svg>\n              </span>\n            </div>\n          </div>\n        </div>\n      ");
        }
        if (Number(data.using_cranes_or_lifting) === 1) {
            html += "\n        <div class=\"active-hazard-card mb-3\">\n          <div class=\"active-hazard-header\">\n            <div class=\"active-hazard-title-wrap\">\n              <span class=\"hazard-warning-icon\">\n                <img src=\"".concat(imgCranesLifting, "\" style=\"width: 24px; height: 24px; object-fit: contain; vertical-align: middle;\">\n              </span>\n              <div>\n                <div class=\"hazard-title\">Cranes &amp; Lifting</div>\n                <div class=\"hazard-risk text-danger\">Lifting Risk</div>\n              </div>\n            </div>\n            <div class=\"hazard-check-status\">\n              <span class=\"hazard-check-circle bg-green-light color-green\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"currentColor\" style=\"width: 16px; height: 16px; display: inline-block;\">\n                  <path fill-rule=\"evenodd\" d=\"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\" clip-rule=\"evenodd\" />\n                </svg>\n              </span>\n            </div>\n          </div>\n        </div>\n      ");
        }
        if (Number(data.power_on) === 1) {
            html += "\n        <div class=\"active-hazard-card mb-3\">\n          <div class=\"active-hazard-header\">\n            <div class=\"active-hazard-title-wrap\">\n              <span class=\"hazard-warning-icon\">\n                <img src=\"".concat(imgElectricalWorks, "\" style=\"width: 24px; height: 24px; object-fit: contain; vertical-align: middle;\">\n              </span>\n              <div>\n                <div class=\"hazard-title\">Electrical Works</div>\n                <div class=\"hazard-risk text-warning\">Electrical Risk</div>\n              </div>\n            </div>\n            <div class=\"hazard-check-status\">\n              <span class=\"hazard-check-circle bg-green-light color-green\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"currentColor\" style=\"width: 16px; height: 16px; display: inline-block;\">\n                  <path fill-rule=\"evenodd\" d=\"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\" clip-rule=\"evenodd\" />\n                </svg>\n              </span>\n            </div>\n          </div>\n        </div>\n      ");
        }
        if (Number(data.pressurization) === 1) {
            html += "\n        <div class=\"active-hazard-card mb-3\">\n          <div class=\"active-hazard-header\">\n            <div class=\"active-hazard-title-wrap\">\n              <span class=\"hazard-warning-icon\">\n                <img src=\"".concat(imgMechanicalWorks, "\" style=\"width: 24px; height: 24px; object-fit: contain; vertical-align: middle;\">\n              </span>\n              <div>\n                <div class=\"hazard-title\">Mechanical Works</div>\n                <div class=\"hazard-risk text-primary\">Mechanical Risk</div>\n              </div>\n            </div>\n            <div class=\"hazard-check-status\">\n              <span class=\"hazard-check-circle bg-green-light color-green\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"currentColor\" style=\"width: 16px; height: 16px; display: inline-block;\">\n                  <path fill-rule=\"evenodd\" d=\"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\" clip-rule=\"evenodd\" />\n                </svg>\n              </span>\n            </div>\n          </div>\n        </div>\n      ");
        }
        if (html === '') {
            html = '<p class="text-muted">No active hazard checklists.</p>';
        }
        return html;
    };
    // Compile complex map loops to safe HTML variables BEFORE starting the return string literal
    var attachmentsHtml = data.files && data.files.length > 0
        ? data.files.map(function (file) {
            var filename = file.ramsFile ? file.ramsFile.split('/').pop() : 'Attachment';
            return "\n          <a href=\"/requests/files/".concat(file.ramsFileId, "\" download class=\"attachment-box\">\n            <div class=\"attachment-icon-wrap\">\n              <svg class=\"attachment-file-icon text-danger\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\">\n                <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z\" />\n              </svg>\n            </div>\n            <div class=\"attachment-details\">\n              <span class=\"attachment-name\">").concat(filename, "</span>\n              <span class=\"attachment-size\">Click to download</span>\n            </div>\n            <div class=\"attachment-download-icon\">\n              <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"currentColor\" style=\"width: 18px; height: 18px; color: #64748b;\">\n                <path fill-rule=\"evenodd\" d=\"M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z\" clip-rule=\"evenodd\" />\n              </svg>\n            </div>\n          </a>\n        ");
        }).join('')
        : '<p class="text-muted">No attachments.</p>';
    var imagesHtml = data.images && data.images.length > 0
        ? data.images.map(function (img, index) { return "\n        <div class=\"col-md-3 mb-3\">\n          <a href=\"#myModal".concat(index, "\" class=\"btn p-0\" data-toggle=\"modal\">\n            <img src=\"").concat(getCheckImageSrc(img.imageName), "\" class=\"img-thumbnail\" style=\"width:100%; height:120px; object-fit:cover;\">\n          </a>\n          \n          <div class=\"modal fade\" id=\"myModal").concat(index, "\" tabindex=\"-1\" role=\"dialog\" aria-hidden=\"true\">\n            <div class=\"modal-dialog modal-lg\">\n              <div class=\"modal-content\">\n                <div class=\"modal-header\">\n                  <h5 class=\"modal-title\">Enlarged Image</h5>\n                  <button type=\"button\" class=\"close\" data-toggle=\"modal\" aria-hidden=\"true\">&times;</button>\n                </div>\n                <div class=\"modal-body text-center\">\n                  <img src=\"").concat(getCheckImageSrc(img.imageName), "\" style=\"max-width:100%; height:auto;\">\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      "); }).join('')
        : '<p class="text-muted">No images uploaded.</p>';
    var notesHtml = data.note && data.note.length > 0
        ? "\n      <div class=\"mt-3\">\n        <div class=\"info-label\">System Notes</div>\n        <table class=\"compact-table\">\n          <thead>\n            <tr>\n              <th>User</th>\n              <th>Note</th>\n            </tr>\n          </thead>\n          <tbody>\n            ".concat(data.note.map(function (n) { return "\n              <tr>\n                <td style=\"width: 120px;\">".concat(n.username || 'System', "</td>\n                <td>").concat(n.note || '', "</td>\n              </tr>\n            "); }).join(''), "\n          </tbody>\n        </table>\n      </div>\n    ")
        : '';
    var conm = data.ConM_initials || 'N/A';
    var comm = data.CoMM_initials || 'N/A';
    var pType = data.permit_type;
    var pUnder = data.permit_under;
    var approvalsHtml = '';
    if (pType === 'Construction' && pUnder === 'Construction') {
        approvalsHtml = "<div class=\"info-label\">ConM initials</div><div class=\"info-value mb-2\">".concat(conm, "</div>");
    }
    else if (pType === 'Construction' && pUnder === 'Commissioning') {
        approvalsHtml = "<div class=\"info-label\">ConM initials</div><div class=\"info-value mb-2\">".concat(conm, "</div><div class=\"info-label\">C&Q initials</div><div class=\"info-value mb-2\">").concat(comm, "</div>");
    }
    else if (pType === 'Commissioning' && pUnder === 'Construction') {
        approvalsHtml = "<div class=\"info-label\">C&Q initials</div><div class=\"info-value mb-2\">".concat(comm, "</div><div class=\"info-label\">ConM initials</div><div class=\"info-value mb-2\">").concat(conm, "</div>");
    }
    else if (pType === 'Commissioning' && pUnder === 'Commissioning') {
        approvalsHtml = "<div class=\"info-label\">C&Q initials</div><div class=\"info-value mb-2\">".concat(comm, "</div>");
    }
    else {
        approvalsHtml = "<div class=\"info-label\">ConM initials</div><div class=\"info-value mb-2\">".concat(conm, "</div>");
    }
    return "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Activity Permit Details</title>\n  <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css\">\n  <link href=\"https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600;700;800&display=swap\" rel=\"stylesheet\">\n  <style>\n    body {\n      background-color: #f1f5f9; /* Modern light-grey theme */\n      margin: 0;\n      padding: 0;\n      font-family: 'Mulish', sans-serif;\n      color: #1e293b;\n    }\n    .permit-container {\n      max-width: 1280px;\n      margin: 32px auto;\n      padding: 0 16px;\n    }\n    .dashboard-card {\n      background: #ffffff;\n      border-radius: 16px;\n      border: 1px solid #e2e8f0;\n      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025);\n      padding: 24px;\n      margin-bottom: 24px;\n      position: relative;\n    }\n    .card-section-header {\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      border-bottom: 1px solid #f1f5f9;\n      padding-bottom: 16px;\n      margin-bottom: 20px;\n    }\n    .card-section-title-wrap {\n      display: flex;\n      align-items: center;\n      gap: 12px;\n    }\n    .card-section-icon {\n      color: #3b82f6;\n      font-size: 20px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    }\n    .card-section-title {\n      font-size: 18px;\n      font-weight: 700;\n      color: #0f172a;\n      margin: 0;\n    }\n    .card-section-subtitle {\n      font-size: 13px;\n      color: #64748b;\n      margin: 4px 0 0 0;\n    }\n    .header-layout {\n      display: flex;\n      justify-content: space-between;\n      align-items: flex-start;\n      margin-bottom: 20px;\n      flex-wrap: wrap;\n      gap: 16px;\n    }\n    .header-title-section {\n      display: flex;\n      align-items: center;\n      gap: 16px;\n    }\n    .back-btn {\n      color: #475569;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      width: 36px;\n      height: 36px;\n      border-radius: 50%;\n      background: #f8fafc;\n      border: 1px solid #e2e8f0;\n      transition: all 0.2s;\n      cursor: pointer;\n    }\n    .back-btn:hover {\n      background: #e2e8f0;\n      color: #0f172a;\n    }\n    .header-details-wrap {\n      display: flex;\n      flex-direction: column;\n      gap: 6px;\n    }\n    .permit-title {\n      font-size: 26px;\n      font-weight: 800;\n      color: #0f172a;\n      margin: 0;\n    }\n    .badge-row {\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      flex-wrap: wrap;\n    }\n    .header-badge {\n      font-size: 12px;\n      font-weight: 600;\n      padding: 4px 12px;\n      border-radius: 9999px;\n      background-color: #e2e8f0;\n      color: #475569;\n    }\n    .header-badge.badge-risk {\n      background-color: #fee2e2;\n      color: #dc2626;\n    }\n    .header-badge.badge-status {\n      background-color: #d1fae5;\n      color: #065f46;\n    }\n    .location-pin-text {\n      font-size: 13px;\n      color: #64748b;\n      font-weight: 600;\n      display: inline-block;\n      vertical-align: middle;\n      word-wrap: break-word;\n      word-break: break-word;\n    }\n    .header-actions {\n      display: flex;\n      align-items: center;\n      gap: 10px;\n    }\n    .btn-action {\n      font-size: 14px;\n      font-weight: 700;\n      padding: 8px 16px;\n      border-radius: 8px;\n      border: 1px solid #e2e8f0;\n      background: #ffffff;\n      color: #334155;\n      cursor: pointer;\n      display: inline-flex;\n      align-items: center;\n      gap: 6px;\n      transition: all 0.2s;\n    }\n    .btn-action:hover {\n      background: #f8fafc;\n      border-color: #cbd5e1;\n    }\n    .btn-action.btn-primary-action {\n      background: #2563eb;\n      color: #ffffff;\n      border-color: #2563eb;\n    }\n    .btn-action.btn-primary-action:hover {\n      background: #1d4ed8;\n    }\n    .triple-dots {\n      color: #94a3b8;\n      cursor: pointer;\n      padding: 8px;\n      font-size: 18px;\n    }\n    \n    /* Stepper styles */\n    .stepper-container {\n      position: relative;\n      margin: 32px 0 8px 0;\n      padding: 0 40px;\n    }\n    .stepper-line {\n      position: absolute;\n      top: 20px;\n      left: 95px;\n      right: 95px;\n      height: 4px;\n      background-color: #e2e8f0;\n      z-index: 1;\n      border-radius: 2px;\n    }\n    .stepper-line-progress {\n      position: absolute;\n      top: 0;\n      left: 0;\n      height: 100%;\n      background-color: #3b82f6;\n      transition: width 0.4s ease;\n    }\n    .stepper-steps {\n      display: flex;\n      justify-content: space-between;\n      position: relative;\n      z-index: 2;\n    }\n    .stepper-step {\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      text-align: center;\n      width: 110px;\n    }\n    .step-circle {\n      width: 44px;\n      height: 44px;\n      border-radius: 50%;\n      background-color: #ffffff;\n      border: 3px solid #e2e8f0;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      color: #94a3b8;\n      margin-bottom: 8px;\n      transition: all 0.3s ease;\n    }\n    .step-circle svg {\n      width: 20px;\n      height: 20px;\n    }\n    .step-label {\n      font-size: 13px;\n      font-weight: 600;\n      color: #64748b;\n      transition: color 0.3s ease;\n    }\n    .step-completed .step-circle {\n      background-color: #2563eb;\n      border-color: #2563eb;\n      color: #ffffff;\n      box-shadow: 0 4px 10px rgba(37, 99, 235, 0.15);\n    }\n    .step-completed .step-label {\n      color: #1e293b;\n      font-weight: 700;\n    }\n    .step-active .step-circle {\n      background-color: #ffffff;\n      border-color: #2563eb;\n      color: #2563eb;\n      box-shadow: 0 0 0 5px rgba(37, 99, 235, 0.15), 0 4px 10px rgba(37, 99, 235, 0.2);\n    }\n    .step-active .step-label {\n      color: #2563eb;\n      font-weight: 800;\n    }\n    .step-upcoming .step-circle {\n      background-color: #f8fafc;\n      border-color: #e2e8f0;\n      color: #94a3b8;\n    }\n\n    /* Rejected State Style */\n    .step-completed.step-rejected .step-circle,\n    .step-active.step-rejected .step-circle {\n      background-color: #ef4444 !important;\n      border-color: #ef4444 !important;\n      color: #ffffff !important;\n      box-shadow: 0 4px 10px rgba(239, 68, 68, 0.2) !important;\n    }\n    .step-completed.step-rejected .step-label,\n    .step-active.step-rejected .step-label {\n      color: #ef4444 !important;\n    }\n\n    /* Cancelled State Style */\n    .step-completed.step-cancelled .step-circle,\n    .step-active.step-cancelled .step-circle {\n      background-color: #f97316 !important;\n      border-color: #f97316 !important;\n      color: #ffffff !important;\n      box-shadow: 0 4px 10px rgba(249, 115, 22, 0.2) !important;\n    }\n    .step-completed.step-cancelled .step-label,\n    .step-active.step-cancelled .step-label {\n      color: #f97316 !important;\n    }\n\n    /* Stats Grid */\n    .stats-row {\n      display: grid;\n      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));\n      gap: 16px;\n      margin-bottom: 24px;\n    }\n    .stats-card {\n      background: #ffffff;\n      border-radius: 12px;\n      border: 1px solid #e2e8f0;\n      padding: 16px;\n      display: flex;\n      align-items: center;\n      gap: 12px;\n      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);\n    }\n    .stats-icon-wrap {\n      width: 40px;\n      height: 40px;\n      border-radius: 50%;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      flex-shrink: 0;\n    }\n    .stats-icon {\n      width: 20px;\n      height: 20px;\n    }\n    .stats-info {\n      display: flex;\n      flex-direction: column;\n    }\n    .stats-label {\n      font-size: 11px;\n      font-weight: 700;\n      color: #94a3b8;\n      text-transform: uppercase;\n      letter-spacing: 0.5px;\n    }\n    .stats-value {\n      font-size: 16px;\n      font-weight: 700;\n      color: #1e293b;\n    }\n    .bg-blue-light { background-color: #eff6ff; }\n    .color-blue { color: #3b82f6; fill: #3b82f6; }\n    .text-blue { color: #2563eb; }\n    .bg-red-light { background-color: #fef2f2; }\n    .color-red { color: #ef4444; fill: #ef4444; }\n    .text-red { color: #dc2626; }\n    .bg-orange-light { background-color: #fff7ed; }\n    .color-orange { color: #f97316; fill: #f97316; }\n    .text-orange { color: #ea580c; }\n    .bg-green-light { background-color: #f0fdf4; }\n    .color-green { color: #22c55e; fill: #22c55e; }\n    .text-green { color: #16a34a; }\n    .bg-grey-light { background-color: #f8fafc; }\n    .color-grey { color: #64748b; fill: #64748b; }\n    .text-grey { color: #475569; }\n    .bg-purple-light { background-color: #faf5ff; }\n    .color-purple { color: #a855f7; fill: #a855f7; }\n    .text-purple { color: #7c3aed; }\n\n    /* Columns Layout */\n    .dashboard-grid {\n      display: grid;\n      grid-template-columns: 4fr 5fr;\n      gap: 24px;\n    }\n    @media (max-width: 992px) {\n      .dashboard-grid {\n        grid-template-columns: 1fr;\n      }\n    }\n\n    /* Key-Value styling */\n    .info-grid {\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      gap: 16px 24px;\n    }\n    .info-label {\n      font-size: 11px;\n      font-weight: 700;\n      color: #94a3b8;\n      letter-spacing: 0.8px;\n      text-transform: uppercase;\n      margin-bottom: 4px;\n    }\n    .info-value {\n      font-size: 15px;\n      font-weight: 600;\n      color: #1e293b;\n      word-wrap: break-word;\n    }\n    .info-fullwidth {\n      grid-column: 1 / -1;\n    }\n\n    /* Precautions Card style */\n    .precautions-card {\n      border-left: 4px solid #f97316;\n      background-color: #fffaf8;\n      padding: 16px;\n      border-radius: 0 12px 12px 0;\n      margin-bottom: 16px;\n    }\n    .precautions-content {\n      font-size: 14px;\n      line-height: 1.6;\n      color: #334155;\n    }\n    .precautions-content ul {\n      margin: 0;\n      padding-left: 20px;\n    }\n\n    /* Attendees and Signatures styling */\n    .compact-table {\n      width: 100%;\n      border-collapse: collapse;\n    }\n    .compact-table th {\n      text-align: left;\n      font-size: 11px;\n      font-weight: 700;\n      color: #94a3b8;\n      letter-spacing: 0.5px;\n      text-transform: uppercase;\n      padding-bottom: 8px;\n      border-bottom: 1px solid #cbd5e1;\n    }\n    .compact-table td {\n      padding: 10px 0;\n      border-bottom: 1px solid #f1f5f9;\n      font-size: 13px;\n      font-weight: 600;\n      color: #334155;\n    }\n    .compact-table tr:last-child td {\n      border-bottom: none;\n    }\n\n    /* Active Hazard card */\n    .active-hazard-card {\n      background-color: #fef2f2;\n      border: 1px solid #fee2e2;\n      border-radius: 12px;\n      padding: 16px;\n    }\n    .active-hazard-header {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      margin-bottom: 12px;\n    }\n    .active-hazard-title-wrap {\n      display: flex;\n      align-items: center;\n      gap: 10px;\n    }\n    .hazard-warning-icon {\n      display: flex;\n      align-items: center;\n    }\n    .hazard-title {\n      font-size: 15px;\n      font-weight: 700;\n      color: #0f172a;\n    }\n    .hazard-risk {\n      font-size: 11px;\n      font-weight: 600;\n      text-transform: uppercase;\n      margin-top: 2px;\n    }\n    .hazard-check-status {\n      display: flex;\n      align-items: center;\n    }\n    .hazard-check-circle {\n      width: 24px;\n      height: 24px;\n      border-radius: 50%;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    }\n    .active-hazard-checks {\n      display: flex;\n      flex-direction: column;\n      gap: 8px;\n      padding-left: 30px;\n    }\n    .hazard-checkbox-label {\n      display: flex;\n      align-items: center;\n      gap: 8px;\n      font-size: 13px;\n      font-weight: 600;\n      color: #475569;\n      cursor: default;\n      margin: 0;\n    }\n    .hazard-checkbox-label input[type=\"checkbox\"] {\n      display: none;\n    }\n    .checkbox-custom {\n      width: 16px;\n      height: 16px;\n      border-radius: 4px;\n      border: 2px solid #cbd5e1;\n      background-color: #ffffff;\n      display: inline-block;\n      position: relative;\n    }\n    .hazard-checkbox-label input[type=\"checkbox\"]:checked + .checkbox-custom {\n      background-color: #2563eb;\n      border-color: #2563eb;\n    }\n    .hazard-checkbox-label input[type=\"checkbox\"]:checked + .checkbox-custom:after {\n      content: \"\";\n      position: absolute;\n      left: 4px;\n      top: 1px;\n      width: 4px;\n      height: 8px;\n      border: solid #ffffff;\n      border-width: 0 2px 2px 0;\n      transform: rotate(45deg);\n    }\n\n    /* PPE grid styling */\n    .ppe-grid {\n      display: grid;\n      grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));\n      gap: 12px;\n      margin-top: 12px;\n    }\n    .ppe-card {\n      border-radius: 12px;\n      padding: 12px;\n      text-align: center;\n      position: relative;\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      justify-content: center;\n      transition: all 0.2s ease;\n      min-height: 100px;\n    }\n    .ppe-card-active {\n      background-color: #eff6ff;\n      border: 1px solid #3b82f6;\n      color: #1e293b;\n    }\n    .ppe-card-inactive {\n      background-color: #f8fafc;\n      border: 1px solid #e2e8f0;\n      color: #94a3b8;\n      opacity: 0.6;\n    }\n    .ppe-badge-wrap {\n      position: absolute;\n      top: -6px;\n      right: 8px;\n    }\n    .ppe-badge {\n      font-size: 8px;\n      font-weight: 700;\n      padding: 1px 6px;\n      border-radius: 9999px;\n      text-transform: uppercase;\n      letter-spacing: 0.5px;\n    }\n    .ppe-status-required {\n      background-color: #2563eb;\n      color: #ffffff;\n    }\n    .ppe-status-na {\n      background-color: #cbd5e1;\n      color: #475569;\n    }\n    .ppe-icon-container {\n      width: 32px;\n      height: 32px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      margin-bottom: 6px;\n    }\n    .ppe-icon {\n      max-width: 100%;\n      max-height: 100%;\n      object-fit: contain;\n    }\n    .ppe-label {\n      font-size: 11px;\n      font-weight: 700;\n    }\n\n    /* Confirmations listing */\n    .confirmation-row {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      padding: 10px 14px;\n      background-color: #f8fafc;\n      border: 1px solid #f1f5f9;\n      border-radius: 8px;\n      margin-bottom: 8px;\n    }\n    .confirmation-row:last-child {\n      margin-bottom: 0;\n    }\n    .confirmation-label {\n      font-size: 13px;\n      font-weight: 600;\n      color: #1e293b;\n    }\n    .confirmation-badge {\n      font-size: 11px;\n      font-weight: 700;\n      padding: 2px 8px;\n      border-radius: 4px;\n      text-transform: uppercase;\n    }\n    .badge-yes {\n      background-color: #d1fae5;\n      color: #065f46;\n    }\n    .badge-no {\n      background-color: #fee2e2;\n      color: #991b1b;\n    }\n\n    /* Attachments download row */\n    .attachments-grid {\n      display: flex;\n      flex-direction: column;\n      gap: 10px;\n    }\n    .attachment-box {\n      display: flex;\n      align-items: center;\n      gap: 10px;\n      background-color: #f8fafc;\n      border: 1px solid #e2e8f0;\n      border-radius: 8px;\n      padding: 10px 12px;\n      text-decoration: none !important;\n      transition: all 0.2s ease;\n    }\n    .attachment-box:hover {\n      background-color: #f1f5f9;\n      border-color: #cbd5e1;\n    }\n    .attachment-icon-wrap {\n      width: 28px;\n      height: 28px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      flex-shrink: 0;\n    }\n    .attachment-file-icon {\n      width: 20px;\n      height: 20px;\n    }\n    .attachment-details {\n      display: flex;\n      flex-direction: column;\n      flex-grow: 1;\n      overflow: hidden;\n    }\n    .attachment-name {\n      font-size: 12px;\n      font-weight: 700;\n      color: #1e293b;\n      white-space: nowrap;\n      overflow: hidden;\n      text-overflow: ellipsis;\n    }\n    .attachment-size {\n      font-size: 10px;\n      color: #94a3b8;\n    }\n    .attachment-download-icon {\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    }\n\n    /* Metadata Row styling */\n    .metadata-rows {\n      display: flex;\n      flex-direction: column;\n      gap: 8px;\n    }\n    .metadata-row {\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n      border-bottom: 1px dashed #f1f5f9;\n      padding-bottom: 8px;\n    }\n    .metadata-row:last-child {\n      border-bottom: none;\n      padding-bottom: 0;\n    }\n    .metadata-label {\n      font-size: 12px;\n      color: #64748b;\n      font-weight: 600;\n    }\n    .metadata-value {\n      font-size: 12px;\n      font-weight: 700;\n      color: #0f172a;\n    }\n\n    /* Bottom checklists HRA section styling */\n    .detailed-section-title {\n      font-size: 16px;\n      font-weight: 800;\n      color: #1e293b;\n      margin-bottom: 12px;\n      border-bottom: 2px solid #e2e8f0;\n      padding-bottom: 8px;\n      display: flex;\n      align-items: center;\n    }\n    .detailed-table {\n      width: 100%;\n      border-collapse: collapse;\n      margin-bottom: 16px;\n      background-color: #ffffff;\n      border: 1px solid #e2e8f0;\n    }\n    .detailed-table th {\n      background-color: #f8fafc;\n      color: #475569;\n      font-weight: 700;\n      font-size: 12px;\n      padding: 10px 14px;\n      border-bottom: 1px solid #e2e8f0;\n    }\n    .detailed-table td {\n      padding: 10px 14px;\n      border-bottom: 1px solid #f1f5f9;\n      font-size: 13px;\n      color: #334155;\n    }\n    .check-cell {\n      text-align: center;\n      width: 50px;\n      padding: 10px 0 !important;\n    }\n    .check-indicator {\n      font-weight: 800;\n      font-size: 14px;\n    }\n    .check-yes { color: #16a34a; }\n    .check-no { color: #dc2626; }\n    .check-na { color: #64748b; }\n\n    /* Footer buttons */\n    .confirm-pg-download-container {\n      text-align: center;\n      margin-top: 32px;\n      padding-bottom: 40px;\n    }\n    .confirm-pg-download-btn {\n      background: #2563eb;\n      color: #ffffff;\n      padding: 12px 32px;\n      border-radius: 8px;\n      border: none;\n      font-size: 15px;\n      font-weight: 700;\n      cursor: pointer;\n      box-shadow: 0 4px 6px rgba(37, 99, 235, 0.15);\n      transition: all 0.2s;\n    }\n    .confirm-pg-download-btn:hover {\n      background: #1d4ed8;\n      transform: translateY(-1px);\n    }\n    \n    @media print {\n      body {\n        background-color: #ffffff;\n        color: #000000;\n      }\n      .permit-container {\n        margin: 0;\n        padding: 0;\n        max-width: 100%;\n      }\n      .dashboard-card {\n        box-shadow: none;\n        border: 1px solid #cbd5e1;\n        page-break-inside: avoid;\n      }\n      .confirm-pg-download-container {\n        display: none;\n      }\n      .back-btn {\n        display: none;\n      }\n    }\n    .dashboard-card,\n.active-hazard-card,\n.stats-card,\n.ppe-card,\n.stepper-container,\n.attachment-box {\n  break-inside: avoid;\n  page-break-inside: avoid;\n}\n\n/* keep table rows from splitting mid-row too */\n.detailed-table tr,\n.compact-table tr {\n  break-inside: avoid;\n  page-break-inside: avoid;\n}\n.dashboard-grid.pdf-single-col {\n  display: block; /* kills the grid, cards just stack */\n}\n.dashboard-grid.pdf-single-col > div {\n  width: 100%;\n}\n  </style>\n</head>\n<body>\n\n  <div class=\"permit-container\" id=\"root\">\n    \n    <!-- Top Dashboard Card (Header, Actions, Stepper) -->\n    <div class=\"dashboard-card\">\n      <div class=\"header-layout\" style=\"display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: nowrap; gap: 16px; width: 100%;\">\n        <div class=\"header-title-section\" style=\"display: flex; align-items: center; gap: 16px; min-width: 0; flex-grow: 1;\">\n          <div class=\"back-btn\" onclick=\"window.history.back()\" style=\"flex-shrink: 0;\">\n            <svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" style=\"width: 20px; height: 20px;\">\n              <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M10 19l-7-7m0 0l7-7m-7 7h18\" />\n            </svg>\n          </div>\n          <div class=\"header-details-wrap\" style=\"min-width: 0; flex-grow: 1;\">\n            <h1 class=\"permit-title\" style=\"margin: 0;\">Permit #".concat(data.PermitNo || '-', "</h1>\n            <div class=\"badge-row\" style=\"margin-top: 4px;\">\n              <span class=\"header-badge\">").concat(data.activityName || data.Activity || 'Activity', "</span>\n              <span class=\"header-badge badge-risk\">").concat(getRiskLevel(), " Risk</span>\n              <span class=\"header-badge badge-status\">").concat(getStatusText(), "</span>\n              <span class=\"location-pin-text\" style=\"display: inline-block; vertical-align: middle;\">\n                <img src=\"").concat(locationPinDataUrl, "\" style=\"width: 14px; height: 14px; display: inline-block; vertical-align: middle; margin-right: 4px;\" />\n                <span style=\"vertical-align: middle;\">").concat(formatRooms(data.room_names || data.Room_Nos || data.zone_name), "</span>\n              </span>\n            </div>\n          </div>\n        </div>\n        <div class=\"header-actions\" style=\"flex-shrink: 0; display: flex; align-items: center; gap: 10px;\">\n          <button class=\"btn-action\" onclick=\"test()\">\n            <svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" style=\"width: 16px; height: 16px;\">\n              <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4\" />\n            </svg>\n            PDF\n          </button>\n          <div class=\"triple-dots\" style=\"padding: 8px;\">&#8942;</div>\n        </div>\n      </div>\n      \n      <!-- Stepper Widget -->\n      <div class=\"stepper-container\">\n        <div class=\"stepper-line\">\n          <div class=\"stepper-line-progress\" style=\"width: ").concat(progressPercent, "%;\"></div>\n        </div>\n        <div class=\"stepper-steps\">\n          ").concat(stepperStepsHtml, "\n        </div>\n      </div>\n    </div>\n\n    <!-- Statistics Row Widget -->\n    <div class=\"stats-row\">\n      <div class=\"stats-card\">\n        <div class=\"stats-icon-wrap bg-blue-light\">\n          <img src=\"").concat(statusIconDataUrl, "\" style=\"width: 20px; height: 20px; display: block;\" />\n        </div>\n        <div class=\"stats-info\">\n          <div class=\"stats-label\">Status</div>\n          <div class=\"stats-value text-blue\">").concat(getStatusText(), "</div>\n        </div>\n      </div>\n      <div class=\"stats-card\">\n        <div class=\"stats-icon-wrap bg-red-light\">\n          <img src=\"").concat(companyIconDataUrl, "\" style=\"width: 20px; height: 20px; display: block;\" />\n        </div>\n        <div class=\"stats-info\">\n          <div class=\"stats-label\">Contractor</div>\n          <div class=\"stats-value text-red\" style=\"white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 110px;\">\n            ").concat(data.subContractorName || data.Company_Name || '-', "\n          </div>\n        </div>\n      </div>\n      <div class=\"stats-card\">\n        <div class=\"stats-icon-wrap bg-orange-light\">\n          <img src=\"").concat(calendarIconDataUrl, "\" style=\"width: 20px; height: 20px; display: block;\" />\n        </div>\n        <div class=\"stats-info\">\n          <div class=\"stats-label\">Date</div>\n          <div class=\"stats-value text-orange\">").concat(formatDateOnly(data.Working_Date), "</div>\n        </div>\n      </div>\n      <div class=\"stats-card\">\n        <div class=\"stats-icon-wrap bg-green-light\">\n          <img src=\"").concat(workersIconDataUrl, "\" style=\"width: 20px; height: 20px; display: block;\" />\n        </div>\n        <div class=\"stats-info\">\n          <div class=\"stats-label\">Workers</div>\n          <div class=\"stats-value text-green\">").concat(data.Number_Of_Workers || '0', "</div>\n        </div>\n      </div>\n      <div class=\"stats-card\">\n        <div class=\"stats-icon-wrap bg-grey-light\">\n          <img src=\"").concat(durationIconDataUrl, "\" style=\"width: 20px; height: 20px; display: block;\" />\n        </div>\n        <div class=\"stats-info\">\n          <div class=\"stats-label\">Duration</div>\n          <div class=\"stats-value text-grey\">").concat(getDuration(), "</div>\n        </div>\n      </div>\n    </div>\n\n    <!-- Two Column Dashboard Grid -->\n    <div class=\"dashboard-grid\">\n      \n      <!-- Left Column -->\n      <div>\n\n        <!-- Check-in & Check-out Status (Moved here, above Location & Schedule) -->\n        ").concat((data.check_in_time || (data.Request_status === 'Closed' && data.check_out_time)) ? "\n          <div class=\"row mb-1\">\n            ".concat(data.check_in_time ? "\n              <div class=\"col-md-6 mb-3\">\n                <div class=\"dashboard-card mb-0\" style=\"background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px;\">\n                  <div class=\"info-label\" style=\"color: #15803d; font-size: 11px;\">Checked In</div>\n                  <div class=\"info-value mb-2\" style=\"color: #166534; font-size: 14px;\">".concat(formatDateTime(data.check_in_time), "</div>\n                  <div class=\"info-label\" style=\"color: #15803d; font-size: 10px;\">User</div>\n                  <div class=\"info-value\" style=\"color: #166534; font-size: 13px;\">").concat(data.check_in_user || '-', "</div>\n                </div>\n              </div>\n            ") : '', "\n            ").concat((data.Request_status === 'Closed' && data.check_out_time) ? "\n              <div class=\"col-md-6 mb-3\">\n                <div class=\"dashboard-card mb-0\" style=\"background-color: #fef2f2; border: 1px solid #fecaca; padding: 16px;\">\n                  <div class=\"info-label\" style=\"color: #b91c1c; font-size: 11px;\">Checked Out</div>\n                  <div class=\"info-value mb-2\" style=\"color: #991b1b; font-size: 14px;\">".concat(formatDateTime(data.check_out_time), "</div>\n                  <div class=\"info-label\" style=\"color: #b91c1c; font-size: 10px;\">User</div>\n                  <div class=\"info-value\" style=\"color: #991b1b; font-size: 13px;\">").concat(data.check_out_user || '-', "</div>\n                </div>\n              </div>\n            ") : '', "\n          </div>\n        ") : '', "\n        \n        <!-- Location & Schedule -->\n        <div class=\"dashboard-card\">\n          <div class=\"card-section-header\">\n            <div class=\"card-section-title-wrap\">\n              <span class=\"card-section-icon\">\n                ").concat(getCardHeaderIcon('location'), "\n              </span>\n              <div>\n                <h2 class=\"card-section-title\">Location & Schedule</h2>\n                <p class=\"card-section-subtitle\">Where and when the work occurs</p>\n              </div>\n            </div>\n          </div>\n          <div class=\"info-grid\">\n            <div>\n              <div class=\"info-label\">Building</div>\n              <div class=\"info-value\">").concat(data.building_name || '-', "</div>\n            </div>\n            <div>\n              <div class=\"info-label\">Level</div>\n              <div class=\"info-value\">").concat(data.Room_Type || '-', "</div>\n            </div>\n            <div>\n              <div class=\"info-label\">Zone</div>\n              <div class=\"info-value\">").concat(data.zone_name || '-', "</div>\n            </div>\n            <div>\n              <!-- Empty spacer to align the grid -->\n            </div>\n            <div class=\"info-fullwidth\">\n              <div class=\"info-label\">Specific Rooms</div>\n              <div class=\"info-value\">").concat(formatRooms(data.room_names || data.Room_Nos), "</div>\n            </div>\n            <div>\n              <div class=\"info-label\">Date</div>\n              <div class=\"info-value\">").concat(formatDateOnly(data.Working_Date), "</div>\n            </div>\n            <div>\n              <div class=\"info-label\">Time</div>\n              <div class=\"info-value\">").concat(formatTimeOnly(data.Start_Time), " - ").concat(formatTimeOnly(data.End_Time), "</div>\n            </div>\n            <div>\n              <div class=\"info-label\">Shift Type</div>\n              <div class=\"info-value\">").concat(Number(data.night_shift) === 1 ? 'Night Shift' : 'Day Shift', "</div>\n            </div>\n          </div>\n        </div>\n\n        <!-- Work Details & Resources -->\n        <div class=\"dashboard-card\">\n          <div class=\"card-section-header\">\n            <div class=\"card-section-title-wrap\">\n              <span class=\"card-section-icon\">\n                ").concat(getCardHeaderIcon('tools'), "\n              </span>\n              <div>\n                <h2 class=\"card-section-title\">Work Details & Resources</h2>\n                <p class=\"card-section-subtitle\">Contractors, tools, and machinery</p>\n              </div>\n            </div>\n          </div>\n          <div class=\"info-grid\">\n            <div class=\"info-fullwidth\">\n              <div class=\"info-label\">Description of Activity</div>\n              <div class=\"info-value\" style=\"font-weight: 700; color: #0f172a; margin-bottom: 8px;\">").concat(data.description_of_activity || data.descriptionOfActivity || '-', "</div>\n            </div>\n            <div>\n              <div class=\"info-label\">Contractor</div>\n              <div class=\"info-value\">").concat(data.subContractorName || data.Company_Name || '-', "</div>\n            </div>\n            <div>\n              <div class=\"info-label\">Supervisor</div>\n              <div class=\"info-value\">").concat(data.Foreman || '-', "</div>\n            </div>\n            <div class=\"info-fullwidth\">\n              <div class=\"info-label\">Tools Used</div>\n              <div class=\"info-value\">").concat(data.Tools || '-', "</div>\n            </div>\n            <div class=\"info-fullwidth\">\n              <div class=\"info-label\">Machinery Used</div>\n              <div class=\"info-value\">").concat(data.Machinery || '-', "</div>\n            </div>\n          </div>\n        </div>\n\n        <!-- Safety Precautions & Notes -->\n        <div class=\"dashboard-card\">\n          <div class=\"card-section-header\">\n            <div class=\"card-section-title-wrap\">\n              <span class=\"card-section-icon\">\n                ").concat(getCardHeaderIcon('safety'), "\n              </span>\n              <div>\n                <h2 class=\"card-section-title\">Safety Precautions & Notes</h2>\n                <p class=\"card-section-subtitle\">Special instructions for this task</p>\n              </div>\n            </div>\n          </div>\n          \n          ").concat(data.resolvedPrecautions && data.resolvedPrecautions.length > 0 ? "\n            <div class=\"precautions-card\">\n              <div class=\"precautions-content\">\n                <ul>\n                  ".concat(data.resolvedPrecautions.map(function (p) { return "<li>".concat(p, "</li>"); }).join(''), "\n                </ul>\n              </div>\n            </div>\n          ") : '', "\n\n          ").concat(notesHtml, "\n        </div>\n\n\n      </div>\n\n      <!-- Right Column -->\n      <div>\n        \n        <!-- Active Hazards -->\n        <div class=\"dashboard-card\">\n          <div class=\"card-section-header\">\n            <div class=\"card-section-title-wrap\">\n              <span class=\"card-section-icon\">\n                ").concat(getCardHeaderIcon('hazards'), "\n              </span>\n              <div>\n                <h2 class=\"card-section-title\">Active Hazards</h2>\n                <p class=\"card-section-subtitle\">Identified risks for this permit</p>\n              </div>\n            </div>\n          </div>\n          <div class=\"active-hazards-list\">\n            ").concat(renderActiveHazardCards(), "\n          </div>\n        </div>\n\n        <!-- Required PPE -->\n        <div class=\"dashboard-card\">\n          <div class=\"card-section-header\">\n            <div class=\"card-section-title-wrap\">\n              <span class=\"card-section-icon\">\n                ").concat(getCardHeaderIcon('check'), "\n              </span>\n              <div>\n                <h2 class=\"card-section-title\">Required PPE</h2>\n                <p class=\"card-section-subtitle\">Mandatory safety equipment</p>\n              </div>\n            </div>\n          </div>\n          <div class=\"ppe-grid\">\n            ").concat(renderPpeCard('Eye Protection', imgEyeProtection, Number(data.eye_protection) === 1), "\n            ").concat(renderPpeCard('Fall Protection', imgFallProtection, Number(data.fall_protection) === 1), "\n            ").concat(renderPpeCard('Hearing Protection', imgHearingProtection, Number(data.hearing_protection) === 1), "\n            ").concat(renderPpeCard('Respiratory Protection', imgRespiratoryProtection, Number(data.respiratory_protection) === 1), "\n          </div>\n          ").concat(data.other_ppe ? "\n            <div class=\"mt-3\">\n              <div class=\"info-label\">Other PPE</div>\n              <div class=\"info-value\">".concat(data.other_ppe, "</div>\n            </div>\n          ") : '', "\n        </div>\n\n\n\n        <!-- Attachments -->\n        <div class=\"dashboard-card\">\n          <div class=\"card-section-header\">\n            <div class=\"card-section-title-wrap\">\n              <span class=\"card-section-icon\">\n                ").concat(getCardHeaderIcon('attachments'), "\n              </span>\n              <div>\n                <h2 class=\"card-section-title\">Attachments</h2>\n                <p class=\"card-section-subtitle\">Documents and images</p>\n              </div>\n            </div>\n          </div>\n          <div class=\"attachments-grid\">\n            ").concat(attachmentsHtml, "\n          </div>\n        </div>\n\n        <!-- Metadata -->\n        <div class=\"dashboard-card\">\n          <div class=\"card-section-header\">\n            <div class=\"card-section-title-wrap\">\n              <span class=\"card-section-icon\">\n                ").concat(getCardHeaderIcon('metadata'), "\n              </span>\n              <div>\n                <h2 class=\"card-section-title\">Metadata</h2>\n                <p class=\"card-section-subtitle\">System tracking details</p>\n              </div>\n            </div>\n          </div>\n          <div class=\"metadata-rows\">\n            <div class=\"metadata-row\">\n              <span class=\"metadata-label\">Created By:</span>\n              <span class=\"metadata-value\">System / ").concat(data.created_by_user || 'Alex Mercer', "</span>\n            </div>\n            <div class=\"metadata-row\">\n              <span class=\"metadata-label\">Created Date:</span>\n              <span class=\"metadata-value\">").concat(formatDateOnly(data.Request_Date), "</span>\n            </div>\n            <div class=\"metadata-row\">\n              <span class=\"metadata-label\">Last Updated:</span>\n              <span class=\"metadata-value\">").concat(formatDateOnly(data.createdTime || data.Request_Date), "</span>\n            </div>\n            <div class=\"metadata-row\">\n              <span class=\"metadata-label\">Owner:</span>\n              <span class=\"metadata-value\">").concat(data.subContractorName || data.Company_Name || 'Apex Construction', "</span>\n            </div>\n          </div>\n        </div>\n\n      </div>\n\n    </div>\n\n    <!-- HRA Detailed Checklists Section (Appended at the bottom) -->\n    <div class=\"mt-4 pt-4 border-top\">\n      \n      <div class=\"d-flex align-items-center gap-2 mb-4\">\n        ").concat(getCardHeaderIcon('hra-main'), "\n        <h3 style=\"font-weight: 800; font-size: 20px; color: #334155; margin: 0; display: inline-block; vertical-align: middle;\">Hazard Risk Assessments (HRAs) & Detailed Checklists</h3>\n      </div>\n\n      <!-- If no HRAs are active, show a clean 'No HRAs' notice at the bottom -->\n      ").concat(activeHazardsCount === 0 ? "\n        <div class=\"dashboard-card text-center\" style=\"padding: 32px; background-color: #f8fafc; border: 1px dashed #cbd5e1; margin-bottom: 24px;\">\n          ".concat(getCardHeaderIcon('no-hra-alert'), "\n          <div style=\"font-size: 16px; font-weight: 700; color: #64748b; margin-top: 12px;\">No Hazard Risk Assessments (HRAs) Active</div>\n          <div style=\"font-size: 13px; color: #94a3b8; margin-top: 4px;\">This permit does not require high-risk checklist controls.</div>\n        </div>\n      ") : '', "\n\n      <!-- General Safety Checklist Detailed Table -->\n      <div class=\"dashboard-card\">\n        <div class=\"detailed-section-title\">\n          General Safety Questions\n        </div>\n        <table class=\"detailed-table\">\n          <thead>\n            <tr>\n              <th>Question</th>\n              <th class=\"check-cell\">Yes</th>\n              <th class=\"check-cell\">No</th>\n              <th class=\"check-cell\">N/A</th>\n            </tr>\n          </thead>\n          <tbody>\n            ").concat(generalSafetyQuestions.map(function (q) { return renderCheckRow(q.text, data[q.id]); }).join(''), "\n            ").concat(Number(data.other_conditions) === 1 ? "\n              <tr>\n                <td colspan=\"4\" class=\"text-danger font-weight-bold\">\n                  <strong>Other Conditions Input:</strong> ".concat(data.other_conditions_input || '-', "\n                </td>\n              </tr>\n            ") : '', "\n          </tbody>\n        </table>\n      </div>\n\n      <!-- Hotwork Checklist Table -->\n      ").concat((function () {
        var isHotWorkActive = Number(data.Hot_work) === 1;
        var isWeldingActive = isHotWorkActive && Number(data.welding_activitiy) === 1;
        if (!isHotWorkActive) {
            return "\n          <div class=\"dashboard-card\" style=\"border-left: 4px solid #ef4444; background-color: #fafafa; opacity: 0.9;\">\n            <div class=\"detailed-section-title\" style=\"margin-bottom: 0; border-bottom: none; padding-bottom: 0; display: flex; justify-content: space-between; align-items: center; width: 100%;\">\n              <div style=\"display: flex; align-items: center;\">\n                ".concat(imgHotWorks ? "<img src=\"".concat(imgHotWorks, "\" style=\"height: 32px; vertical-align: middle; margin-right: 8px;\">") : '', "\n                <span style=\"color: #64748b;\">Hotwork Checklist</span>\n              </div>\n              <span class=\"badge\" style=\"background-color: #fee2e2; color: #ef4444; border: 1px solid #fecaca; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;\">No</span>\n            </div>\n          </div>\n        ");
        }
        return "\n        <div class=\"dashboard-card\" style=\"border-left: 4px solid #16a34a;\">\n          <div class=\"detailed-section-title\" style=\"display: flex; justify-content: space-between; align-items: center;\">\n            <div style=\"display: flex; align-items: center;\">\n              ".concat(imgHotWorks ? "<img src=\"".concat(imgHotWorks, "\" style=\"height: 32px; vertical-align: middle; margin-right: 8px;\">") : '', "\n              Hotwork Checklist\n            </div>\n            <span class=\"badge\" style=\"background-color: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;\">Yes</span>\n          </div>\n          <table class=\"detailed-table\">\n            <thead>\n              <tr>\n                <th>Question</th>\n                <th class=\"check-cell\">Yes</th>\n                <th class=\"check-cell\">No</th>\n                <th class=\"check-cell\">N/A</th>\n              </tr>\n            </thead>\n            <tbody>\n              ").concat(hotWorkQuestions.map(function (q) { return renderCheckRow(q.text, data[q.id]); }).join(''), "\n            </tbody>\n          </table>\n\n          <div class=\"row mt-3\">\n            <div class=\"col-md-6\">\n              <div class=\"info-label\">Is there any welding activity?</div>\n              <div class=\"info-value\">").concat(isWeldingActive ? 'Yes' : 'No', "</div>\n            </div>\n            <div class=\"col-md-6\">\n              <table class=\"detailed-table\">\n                <thead>\n                  <tr>\n                    <th>Welding Question</th>\n                    <th class=\"check-cell\">Yes</th>\n                    <th class=\"check-cell\">No</th>\n                    <th class=\"check-cell\">N/A</th>\n                  </tr>\n                </thead>\n                <tbody>\n                  ").concat(weldingQuestions.map(function (q) { return renderCheckRow(q.text, isWeldingActive ? data[q.id] : 0); }).join(''), "\n                </tbody>\n              </table>\n            </div>\n          </div>\n\n          <div class=\"row mt-3\">\n            <div class=\"col-md-6\">\n              <div class=\"info-grid\">\n                <div>\n                  <div class=\"info-label\">Low Risk Hotwork</div>\n                  <div class=\"info-value\">").concat(Number(data.low_risk_hotwork) === 1 ? 'Yes' : 'No', "</div>\n                </div>\n                <div>\n                  <div class=\"info-label\">High Risk Hotwork</div>\n                  <div class=\"info-value\">").concat(Number(data.high_risk_hotwork) === 1 ? 'Yes' : 'No', "</div>\n                </div>\n                <div>\n                  <div class=\"info-label\">Hot Work Checklist Filled</div>\n                  <div class=\"info-value\">").concat(Number(data.hot_work_checklist_filled) === 1 ? 'Yes' : 'No', "</div>\n                </div>\n                <div>\n                  <div class=\"info-label\">Fire Guard Present</div>\n                  <div class=\"info-value\">").concat(Number(data.fire_guard_present) === 1 ? 'Yes' : 'No', "</div>\n                </div>\n              </div>\n            </div>\n            <div class=\"col-md-6 text-center\">\n              ").concat(data.fire_image ? "\n                <div class=\"info-label\">Fire Watch Image</div>\n                <img src=\"".concat(getFireImageUrl(data.fire_image), "\" style=\"max-width: 140px; height: auto; border-radius: 8px; border: 1px solid #cbd5e1; margin-top: 8px;\">\n              ") : '', "\n            </div>\n          </div>\n\n          <div class=\"mt-4 border-top pt-3\">\n            <table class=\"detailed-table\">\n              <tbody>\n                ").concat(renderCheckRow('Has the work area been inspected for smoldering materials or residual heat?', data.h_heat_source), "\n                ").concat(renderCheckRow('Have all tools and hot work equipment been safely removed from the work area?', data.h_workplace_check), "\n                ").concat(renderCheckRow('Has the area been cleaned and restored to its original safe condition?', data.h_fire_detectors), "\n                <tr>\n                  <td>1hr Check time</td>\n                  <td colspan=\"3\">").concat(data.h_start_time && data.h_start_time !== '1970' ? data.h_start_time : 'N/A', "</td>\n                </tr>\n                <tr>\n                  <td>3hrs Check time</td>\n                  <td colspan=\"3\">").concat(data.h_end_time && data.h_end_time !== '1970' ? data.h_end_time : 'N/A', "</td>\n                </tr>\n              </tbody>\n            </table>\n          </div>\n        </div>\n      ");
    })(), "\n\n      <!-- Temporary Site Electrical Systems Table -->\n      ").concat((function () {
        var isElecActive = Number(data.working_on_electrical_system) === 1;
        if (!isElecActive) {
            return "\n          <div class=\"dashboard-card\" style=\"border-left: 4px solid #ef4444; background-color: #fafafa; opacity: 0.9;\">\n            <div class=\"detailed-section-title\" style=\"margin-bottom: 0; border-bottom: none; padding-bottom: 0; display: flex; justify-content: space-between; align-items: center; width: 100%;\">\n              <div style=\"display: flex; align-items: center;\">\n                ".concat(imgElectricalSystems ? "<img src=\"".concat(imgElectricalSystems, "\" style=\"height: 32px; vertical-align: middle; margin-right: 8px;\">") : '', "\n                <span style=\"color: #64748b;\">Temporary Site Electrical Systems</span>\n              </div>\n              <span class=\"badge\" style=\"background-color: #fee2e2; color: #ef4444; border: 1px solid #fecaca; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;\">No</span>\n            </div>\n          </div>\n        ");
        }
        return "\n        <div class=\"dashboard-card\" style=\"border-left: 4px solid #16a34a;\">\n          <div class=\"detailed-section-title\" style=\"display: flex; justify-content: space-between; align-items: center;\">\n            <div style=\"display: flex; align-items: center;\">\n              ".concat(imgElectricalSystems ? "<img src=\"".concat(imgElectricalSystems, "\" style=\"height: 32px; vertical-align: middle; margin-right: 8px;\">") : '', "\n              Temporary Site Electrical Systems\n            </div>\n            <span class=\"badge\" style=\"background-color: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;\">Yes</span>\n          </div>\n          <table class=\"detailed-table\">\n            <thead>\n              <tr>\n                <th>Question</th>\n                <th class=\"check-cell\">Yes</th>\n                <th class=\"check-cell\">No</th>\n                <th class=\"check-cell\">N/A</th>\n              </tr>\n            </thead>\n            <tbody>\n              ").concat(electricalQuestions.map(function (q) { return renderCheckRow(q.text, data[q.id]); }).join(''), "\n            </tbody>\n          </table>\n        </div>\n        ");
    })(), "\n\n      <!-- Working with Hazardous Substances/Chemicals -->\n      ").concat((function () {
        var isChemActive = Number(data.working_hazardious_substen) === 1;
        if (!isChemActive) {
            return "\n          <div class=\"dashboard-card\" style=\"border-left: 4px solid #ef4444; background-color: #fafafa; opacity: 0.9;\">\n            <div class=\"detailed-section-title\" style=\"margin-bottom: 0; border-bottom: none; padding-bottom: 0; display: flex; justify-content: space-between; align-items: center; width: 100%;\">\n              <div style=\"display: flex; align-items: center;\">\n                ".concat(imgSubstanceChemical ? "<img src=\"".concat(imgSubstanceChemical, "\" style=\"height: 32px; vertical-align: middle; margin-right: 8px;\">") : '', "\n                <span style=\"color: #64748b;\">Working with Hazardous Substances/Chemicals</span>\n              </div>\n              <span class=\"badge\" style=\"background-color: #fee2e2; color: #ef4444; border: 1px solid #fecaca; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;\">No</span>\n            </div>\n          </div>\n        ");
        }
        return "\n        <div class=\"dashboard-card\" style=\"border-left: 4px solid #16a34a;\">\n          <div class=\"detailed-section-title\" style=\"display: flex; justify-content: space-between; align-items: center;\">\n            <div style=\"display: flex; align-items: center;\">\n              ".concat(imgSubstanceChemical ? "<img src=\"".concat(imgSubstanceChemical, "\" style=\"height: 32px; vertical-align: middle; margin-right: 8px;\">") : '', "\n              Working with Hazardous Substances/Chemicals\n            </div>\n            <span class=\"badge\" style=\"background-color: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;\">Yes</span>\n          </div>\n          <table class=\"detailed-table\">\n            <thead>\n              <tr>\n                <th>Question</th>\n                <th class=\"check-cell\">Yes</th>\n                <th class=\"check-cell\">No</th>\n                <th class=\"check-cell\">N/A</th>\n              </tr>\n            </thead>\n            <tbody>\n              ").concat(chemicalQuestions.map(function (q) { return renderCheckRow(q.text, data[q.id]); }).join(''), "\n            </tbody>\n          </table>\n        </div>\n        ");
    })(), "\n\n      <!-- Pressure Testing of Equipment -->\n      ").concat((function () {
        if (data.permit_type !== 'Commissioning')
            return '';
        var isPressureActive = Number(data.pressure_testing_of_equipment) === 1;
        if (!isPressureActive) {
            return "\n          <div class=\"dashboard-card\" style=\"border-left: 4px solid #ef4444; background-color: #fafafa; opacity: 0.9;\">\n            <div class=\"detailed-section-title\" style=\"margin-bottom: 0; border-bottom: none; padding-bottom: 0; display: flex; justify-content: space-between; align-items: center; width: 100%;\">\n              <div style=\"display: flex; align-items: center;\">\n                ".concat(imgTestingEquipment ? "<img src=\"".concat(imgTestingEquipment, "\" style=\"height: 32px; vertical-align: middle; margin-right: 8px;\">") : '', "\n                <span style=\"color: #64748b;\">Pressure Testing of Equipment</span>\n              </div>\n              <span class=\"badge\" style=\"background-color: #fee2e2; color: #ef4444; border: 1px solid #fecaca; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;\">No</span>\n            </div>\n          </div>\n        ");
        }
        return "\n        <div class=\"dashboard-card\" style=\"border-left: 4px solid #16a34a;\">\n          <div class=\"detailed-section-title\" style=\"display: flex; justify-content: space-between; align-items: center;\">\n            <div style=\"display: flex; align-items: center;\">\n              ".concat(imgTestingEquipment ? "<img src=\"".concat(imgTestingEquipment, "\" style=\"height: 32px; vertical-align: middle; margin-right: 8px;\">") : '', "\n              Pressure Testing of Equipment\n            </div>\n            <span class=\"badge\" style=\"background-color: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;\">Yes</span>\n          </div>\n          <table class=\"detailed-table\">\n            <thead>\n              <tr>\n                <th>Question</th>\n                <th class=\"check-cell\">Yes</th>\n                <th class=\"check-cell\">No</th>\n                <th class=\"check-cell\">N/A</th>\n              </tr>\n            </thead>\n            <tbody>\n              ").concat(pressureQuestions.map(function (q) { return renderCheckRow(q.text, data[q.id]); }).join(''), "\n            </tbody>\n          </table>\n        </div>\n        ");
    })(), "\n\n      <!-- Working at Height -->\n      ").concat((function () {
        var isHeightActive = Number(data.working_at_height) === 1;
        if (!isHeightActive) {
            return "\n          <div class=\"dashboard-card\" style=\"border-left: 4px solid #ef4444; background-color: #fafafa; opacity: 0.9;\">\n            <div class=\"detailed-section-title\" style=\"margin-bottom: 0; border-bottom: none; padding-bottom: 0; display: flex; justify-content: space-between; align-items: center; width: 100%;\">\n              <div style=\"display: flex; align-items: center;\">\n                ".concat(imgWorkingAtHight ? "<img src=\"".concat(imgWorkingAtHight, "\" style=\"height: 32px; vertical-align: middle; margin-right: 8px;\">") : '', "\n                <span style=\"color: #64748b;\">Working at Height</span>\n              </div>\n              <span class=\"badge\" style=\"background-color: #fee2e2; color: #ef4444; border: 1px solid #fecaca; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;\">No</span>\n            </div>\n          </div>\n        ");
        }
        return "\n        <div class=\"dashboard-card\" style=\"border-left: 4px solid #16a34a;\">\n          <div class=\"detailed-section-title\" style=\"display: flex; justify-content: space-between; align-items: center;\">\n            <div style=\"display: flex; align-items: center;\">\n              ".concat(imgWorkingAtHight ? "<img src=\"".concat(imgWorkingAtHight, "\" style=\"height: 32px; vertical-align: middle; margin-right: 8px;\">") : '', "\n              Working at Height\n            </div>\n            <span class=\"badge\" style=\"background-color: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;\">Yes</span>\n          </div>\n          <table class=\"detailed-table\">\n            <thead>\n              <tr>\n                <th>Question</th>\n                <th class=\"check-cell\">Yes</th>\n                <th class=\"check-cell\">No</th>\n                <th class=\"check-cell\">N/A</th>\n              </tr>\n            </thead>\n            <tbody>\n              ").concat(heightQuestions.map(function (q) { return renderCheckRow(q.text, data[q.id]); }).join(''), "\n            </tbody>\n          </table>\n        </div>\n        ");
    })(), "\n\n      <!-- Working in Confined Space -->\n      ").concat((function () {
        var isConfinedActive = Number(data.working_confined_spaces) === 1;
        if (!isConfinedActive) {
            return "\n          <div class=\"dashboard-card\" style=\"border-left: 4px solid #ef4444; background-color: #fafafa; opacity: 0.9;\">\n            <div class=\"detailed-section-title\" style=\"margin-bottom: 0; border-bottom: none; padding-bottom: 0; display: flex; justify-content: space-between; align-items: center; width: 100%;\">\n              <div style=\"display: flex; align-items: center;\">\n                ".concat(imgConfinedSpace ? "<img src=\"".concat(imgConfinedSpace, "\" style=\"height: 32px; vertical-align: middle; margin-right: 8px;\">") : '', "\n                <span style=\"color: #64748b;\">Working in Confined Space</span>\n              </div>\n              <span class=\"badge\" style=\"background-color: #fee2e2; color: #ef4444; border: 1px solid #fecaca; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;\">No</span>\n            </div>\n          </div>\n        ");
        }
        return "\n        <div class=\"dashboard-card\" style=\"border-left: 4px solid #16a34a;\">\n          <div class=\"detailed-section-title\" style=\"display: flex; justify-content: space-between; align-items: center;\">\n            <div style=\"display: flex; align-items: center;\">\n              ".concat(imgConfinedSpace ? "<img src=\"".concat(imgConfinedSpace, "\" style=\"height: 32px; vertical-align: middle; margin-right: 8px;\">") : '', "\n              Working in Confined Space\n            </div>\n            <span class=\"badge\" style=\"background-color: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;\">Yes</span>\n          </div>\n          <table class=\"detailed-table\">\n            <thead>\n              <tr>\n                <th>Question</th>\n                <th class=\"check-cell\">Yes</th>\n                <th class=\"check-cell\">No</th>\n                <th class=\"check-cell\">N/A</th>\n              </tr>\n            </thead>\n            <tbody>\n              ").concat(confinedQuestions.map(function (q) { return renderCheckRow(q.text, data[q.id]); }).join(''), "\n            </tbody>\n          </table>\n        </div>\n        ");
    })(), "\n\n      <!-- Excavation Works -->\n      ").concat((function () {
        var isExcavationActive = Number(data.excavation_works) === 1;
        if (!isExcavationActive) {
            return "\n          <div class=\"dashboard-card\" style=\"border-left: 4px solid #ef4444; background-color: #fafafa; opacity: 0.9;\">\n            <div class=\"detailed-section-title\" style=\"margin-bottom: 0; border-bottom: none; padding-bottom: 0; display: flex; justify-content: space-between; align-items: center; width: 100%;\">\n              <div style=\"display: flex; align-items: center;\">\n                ".concat(imgExcavationWorks ? "<img src=\"".concat(imgExcavationWorks, "\" style=\"height: 32px; vertical-align: middle; margin-right: 8px;\">") : '', "\n                <span style=\"color: #64748b;\">Excavation Works</span>\n              </div>\n              <span class=\"badge\" style=\"background-color: #fee2e2; color: #ef4444; border: 1px solid #fecaca; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;\">No</span>\n            </div>\n          </div>\n        ");
        }
        return "\n        <div class=\"dashboard-card\" style=\"border-left: 4px solid #16a34a;\">\n          <div class=\"detailed-section-title\" style=\"display: flex; justify-content: space-between; align-items: center;\">\n            <div style=\"display: flex; align-items: center;\">\n              ".concat(imgExcavationWorks ? "<img src=\"".concat(imgExcavationWorks, "\" style=\"height: 32px; vertical-align: middle; margin-right: 8px;\">") : '', "\n              Excavation Works\n            </div>\n            <span class=\"badge\" style=\"background-color: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;\">Yes</span>\n          </div>\n          <table class=\"detailed-table\">\n            <thead>\n              <tr>\n                <th>Question</th>\n                <th class=\"check-cell\">Yes</th>\n                <th class=\"check-cell\">No</th>\n                <th class=\"check-cell\">N/A</th>\n              </tr>\n            </thead>\n            <tbody>\n              ").concat(excavationQuestions.map(function (q) { return renderCheckRow(q.text, data[q.id]); }).join(''), "\n            </tbody>\n          </table>\n        </div>\n        ");
    })(), "\n\n      <!-- Crane and Lifting Operations -->\n      ").concat((function () {
        var isLiftingActive = Number(data.using_cranes_or_lifting) === 1;
        if (!isLiftingActive) {
            return "\n          <div class=\"dashboard-card\" style=\"border-left: 4px solid #ef4444; background-color: #fafafa; opacity: 0.9;\">\n            <div class=\"detailed-section-title\" style=\"margin-bottom: 0; border-bottom: none; padding-bottom: 0; display: flex; justify-content: space-between; align-items: center; width: 100%;\">\n              <div style=\"display: flex; align-items: center;\">\n                ".concat(imgCranesLifting ? "<img src=\"".concat(imgCranesLifting, "\" style=\"height: 32px; vertical-align: middle; margin-right: 8px;\">") : '', "\n                <span style=\"color: #64748b;\">Crane and Lifting Operations</span>\n              </div>\n              <span class=\"badge\" style=\"background-color: #fee2e2; color: #ef4444; border: 1px solid #fecaca; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;\">No</span>\n            </div>\n          </div>\n        ");
        }
        return "\n        <div class=\"dashboard-card\" style=\"border-left: 4px solid #16a34a;\">\n          <div class=\"detailed-section-title\" style=\"display: flex; justify-content: space-between; align-items: center;\">\n            <div style=\"display: flex; align-items: center;\">\n              ".concat(imgCranesLifting ? "<img src=\"".concat(imgCranesLifting, "\" style=\"height: 32px; vertical-align: middle; margin-right: 8px;\">") : '', "\n              Crane and Lifting Operations\n            </div>\n            <span class=\"badge\" style=\"background-color: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;\">Yes</span>\n          </div>\n          <table class=\"detailed-table\">\n            <thead>\n              <tr>\n                <th>Question</th>\n                <th class=\"check-cell\">Yes</th>\n                <th class=\"check-cell\">No</th>\n                <th class=\"check-cell\">N/A</th>\n              </tr>\n            </thead>\n            <tbody>\n              ").concat(liftingQuestions.map(function (q) { return renderCheckRow(q.text, data[q.id]); }).join(''), "\n            </tbody>\n          </table>\n        </div>\n        ");
    })(), "\n\n      <!-- Energising, Isolating and Working on Live Electrical Systems -->\n      ").concat((function () {
        if (data.permit_type !== 'Commissioning')
            return '';
        var isPowerActive = Number(data.power_on) === 1;
        var isEnergisingActive = isPowerActive && Number(data.energising_equipment) === 1;
        var isIsolatingActive = isPowerActive && Number(data.isolating_live) === 1;
        var isWorkingNearLiveActive = isPowerActive && Number(data.working_near_live) === 1;
        if (!isPowerActive) {
            return "\n          <div class=\"dashboard-card\" style=\"border-left: 4px solid #ef4444; background-color: #fafafa; opacity: 0.9;\">\n            <div class=\"detailed-section-title\" style=\"margin-bottom: 0; border-bottom: none; padding-bottom: 0; display: flex; justify-content: space-between; align-items: center; width: 100%;\">\n              <div style=\"display: flex; align-items: center;\">\n                ".concat(imgElectricalWorks ? "<img src=\"".concat(imgElectricalWorks, "\" style=\"height: 32px; vertical-align: middle; margin-right: 8px;\">") : '', "\n                <span style=\"color: #64748b;\">Energising, Isolating & Working on Live Electrical Systems</span>\n              </div>\n              <span class=\"badge\" style=\"background-color: #fee2e2; color: #ef4444; border: 1px solid #fecaca; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;\">No</span>\n            </div>\n          </div>\n        ");
        }
        return "\n        <div class=\"dashboard-card\" style=\"border-left: 4px solid #16a34a;\">\n          <div class=\"detailed-section-title\" style=\"display: flex; justify-content: space-between; align-items: center;\">\n            <div style=\"display: flex; align-items: center;\">\n              ".concat(imgElectricalWorks ? "<img src=\"".concat(imgElectricalWorks, "\" style=\"height: 32px; vertical-align: middle; margin-right: 8px;\">") : '', "\n              Energising, Isolating & Working on Live Electrical Systems\n            </div>\n            <span class=\"badge\" style=\"background-color: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;\">Yes</span>\n          </div>\n\n          <div class=\"font-weight-bold mt-2 mb-2\" style=\"").concat(isEnergisingActive ? '' : 'color: #64748b;', "\">\n            Sub-Section: Energising Electrical Equipment\n            <span class=\"badge\" style=\"margin-left: 6px; background-color: ").concat(isEnergisingActive ? '#dcfce7' : '#fee2e2', "; color: ").concat(isEnergisingActive ? '#16a34a' : '#ef4444', "; border: 1px solid ").concat(isEnergisingActive ? '#bbf7d0' : '#fecaca', "; padding: 2px 8px; border-radius: 4px; font-size: 11px;\">\n              ").concat(isEnergisingActive ? 'Yes' : 'No', "\n            </span>\n          </div>\n          ").concat(isEnergisingActive ? "\n          <table class=\"detailed-table\">\n            <thead>\n              <tr>\n                <th>Question</th>\n                <th class=\"check-cell\">Yes</th>\n                <th class=\"check-cell\">No</th>\n                <th class=\"check-cell\">N/A</th>\n              </tr>\n            </thead>\n            <tbody>\n              ".concat(energisingElecQuestions.map(function (q) { return renderCheckRow(q.text, data[q.id]); }).join(''), "\n            </tbody>\n          </table>\n          ") : '', "\n\n          <div class=\"font-weight-bold mt-3 mb-2\" style=\"").concat(isIsolatingActive ? '' : 'color: #64748b;', "\">\n            Sub-Section: Isolating Live Electrical Systems for Maintenance or Modification\n            <span class=\"badge\" style=\"margin-left: 6px; background-color: ").concat(isIsolatingActive ? '#dcfce7' : '#fee2e2', "; color: ").concat(isIsolatingActive ? '#16a34a' : '#ef4444', "; border: 1px solid ").concat(isIsolatingActive ? '#bbf7d0' : '#fecaca', "; padding: 2px 8px; border-radius: 4px; font-size: 11px;\">\n              ").concat(isIsolatingActive ? 'Yes' : 'No', "\n            </span>\n          </div>\n          ").concat(isIsolatingActive ? "\n          <table class=\"detailed-table\">\n            <thead>\n              <tr>\n                <th>Question</th>\n                <th class=\"check-cell\">Yes</th>\n                <th class=\"check-cell\">No</th>\n                <th class=\"check-cell\">N/A</th>\n              </tr>\n            </thead>\n            <tbody>\n              ".concat(isolatingElecQuestions.map(function (q) { return renderCheckRow(q.text, data[q.id]); }).join(''), "\n            </tbody>\n          </table>\n          ") : '', "\n\n          <div class=\"font-weight-bold mt-3 mb-2\" style=\"").concat(isWorkingNearLiveActive ? '' : 'color: #64748b;', "\">\n            Sub-Section: Working on OR near live electrical systems\n            <span class=\"badge\" style=\"margin-left: 6px; background-color: ").concat(isWorkingNearLiveActive ? '#dcfce7' : '#fee2e2', "; color: ").concat(isWorkingNearLiveActive ? '#16a34a' : '#ef4444', "; border: 1px solid ").concat(isWorkingNearLiveActive ? '#bbf7d0' : '#fecaca', "; padding: 2px 8px; border-radius: 4px; font-size: 11px;\">\n              ").concat(isWorkingNearLiveActive ? 'Yes' : 'No', "\n            </span>\n          </div>\n          ").concat(isWorkingNearLiveActive ? "\n          <table class=\"detailed-table\">\n            <thead>\n              <tr>\n                <th>Question</th>\n                <th class=\"check-cell\">Yes</th>\n                <th class=\"check-cell\">No</th>\n                <th class=\"check-cell\">N/A</th>\n              </tr>\n            </thead>\n            <tbody>\n              ".concat(workingNearLiveQuestions.map(function (q) { return renderCheckRow(q.text, data[q.id]); }).join(''), "\n            </tbody>\n          </table>\n          ") : '', "\n        </div>\n      ");
    })(), "\n\n      <!-- Energisation of Mechanical equipment -->\n      ").concat((function () {
        if (data.permit_type !== 'Commissioning')
            return '';
        var isPressurizeActive = Number(data.pressurization) === 1;
        if (!isPressurizeActive) {
            return "\n          <div class=\"dashboard-card\" style=\"border-left: 4px solid #ef4444; background-color: #fafafa; opacity: 0.9;\">\n            <div class=\"detailed-section-title\" style=\"margin-bottom: 0; border-bottom: none; padding-bottom: 0; display: flex; justify-content: space-between; align-items: center; width: 100%;\">\n              <div style=\"display: flex; align-items: center;\">\n                ".concat(imgMechanicalWorks ? "<img src=\"".concat(imgMechanicalWorks, "\" style=\"height: 32px; vertical-align: middle; margin-right: 8px;\">") : '', "\n                <span style=\"color: #64748b;\">Energisation of Mechanical equipment</span>\n              </div>\n              <span class=\"badge\" style=\"background-color: #fee2e2; color: #ef4444; border: 1px solid #fecaca; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;\">No</span>\n            </div>\n          </div>\n        ");
        }
        return "\n        <div class=\"dashboard-card\" style=\"border-left: 4px solid #16a34a;\">\n          <div class=\"detailed-section-title\" style=\"display: flex; justify-content: space-between; align-items: center;\">\n            <div style=\"display: flex; align-items: center;\">\n              ".concat(imgMechanicalWorks ? "<img src=\"".concat(imgMechanicalWorks, "\" style=\"height: 32px; vertical-align: middle; margin-right: 8px;\">") : '', "\n              Energisation of Mechanical equipment\n            </div>\n            <span class=\"badge\" style=\"background-color: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;\">Yes</span>\n          </div>\n          <table class=\"detailed-table\">\n            <thead>\n              <tr>\n                <th>Question</th>\n                <th class=\"check-cell\">Yes</th>\n                <th class=\"check-cell\">No</th>\n                <th class=\"check-cell\">N/A</th>\n              </tr>\n            </thead>\n            <tbody>\n              ").concat(mechanicalQuestions.map(function (q) { return renderCheckRow(q.text, data[q.id]); }).join(''), "\n            </tbody>\n          </table>\n        </div>\n        ");
    })(), "\n\n\n\n      <!-- Approvals and Notes original signoffs -->\n      <div class=\"dashboard-card\">\n        <div class=\"detailed-section-title\">\n          Detailed Approvals & Notes\n        </div>\n        <div class=\"row\">\n          <div class=\"col-md-6\">\n            ").concat(approvalsHtml, "\n            <div class=\"info-label mt-2\">The person responsible for this work</div>\n            <div class=\"info-value\">").concat(data.ConM_initials1 || 'N/A', "</div>\n          </div>\n          <div class=\"col-md-6\">\n            <div class=\"info-label\">Reject Reason</div>\n            <div class=\"info-value mb-2\">").concat(data.reject_reason || 'N/A', "</div>\n            <div class=\"info-label\">Cancel Reason</div>\n            <div class=\"info-value mb-2\">").concat(data.cancel_reason || 'N/A', "</div>\n            <div class=\"info-label\">Close Note</div>\n            <div class=\"info-value\">").concat(data.close_note || 'N/A', "</div>\n          </div>\n        </div>\n      </div>\n\n      <!-- Upload Images Section (For Checkin/Checkout Picture popups) -->\n      <div class=\"dashboard-card\">\n        <div class=\"detailed-section-title\">\n          Uploaded Check-in & Check-out Pictures\n        </div>\n        <div class=\"row\">\n          ").concat(imagesHtml, "\n        </div>\n      </div>\n\n    </div>\n\n    <!-- Download PDF Footer Button -->\n    <div class=\"confirm-pg-download-container\">\n      <button class=\"confirm-pg-download-btn\" onclick=\"test()\">\n        Download Official PDF\n      </button>\n    </div>\n\n  </div>\n\n  <!-- BootStrap & pdf generation scripts -->\n  <script src=\"https://code.jquery.com/jquery-3.6.0.min.js\"></script>\n  <script src=\"https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js\"></script>\n  <script src=\"https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js\"></script>\n  <script>\n    function test() {\n      window.location.href = \"/requests/permit-design/").concat(data.PermitNo, "/pdf\";\n    }\n  </script>\n</body>\n</html>\n  ");
}
