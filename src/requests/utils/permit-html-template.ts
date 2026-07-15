import { join } from 'path';
import { getBase64Image } from './image-utils';

export function generatePermitHtml(data: any): string {
  const imgEyeProtection = getBase64Image(join(process.cwd(), 'src/images/safetyIcons/Eyeprotection.png'));
  const imgFallProtection = getBase64Image(join(process.cwd(), 'src/images/safetyIcons/Fallprotection.png'));
  const imgHearingProtection = getBase64Image(join(process.cwd(), 'src/images/safetyIcons/Hearingprotection.png'));
  const imgRespiratoryProtection = getBase64Image(join(process.cwd(), 'src/images/safetyIcons/Respiratoryprotection.png'));

  const imgHotWorks = getBase64Image(join(process.cwd(), 'src/images/logos/HotWorks.png'));
  const imgElectricalSystems = getBase64Image(join(process.cwd(), 'src/images/logos/ElectricalSystems.png'));
  const imgSubstanceChemical = getBase64Image(join(process.cwd(), 'src/images/logos/substanceChemical.png'));
  const imgTestingEquipment = getBase64Image(join(process.cwd(), 'src/images/logos/testingequipment.png'));
  const imgWorkingAtHight = getBase64Image(join(process.cwd(), 'src/images/logos/WorkingAtHight.png'));
  const imgConfinedSpace = getBase64Image(join(process.cwd(), 'src/images/logos/ConfinedSpace.png'));
  const imgExcavationWorks = getBase64Image(join(process.cwd(), 'src/images/logos/ExcavationWorks.png'));
  const imgCranesLifting = getBase64Image(join(process.cwd(), 'src/images/logos/Craneslifting.png'));
  const imgElectricalWorks = getBase64Image(join(process.cwd(), 'src/images/logos/electrical_works.png'));
  const imgMechanicalWorks = getBase64Image(join(process.cwd(), 'src/images/logos/mechanical1.png'));

  // Format Helper for Date
  const formatDateOnly = (dateStr: any) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${String(d.getDate()).padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
    } catch {
      return String(dateStr);
    }
  };

  // Format Helper for Room names / Zone names
  const formatRooms = (roomsStr: any) => {
    if (!roomsStr) return '-';
    return String(roomsStr).split(',').map(r => r.trim()).filter(Boolean).join(', ');
  };

  // Format Helper for Date + Time
  const formatDateTime = (dateStr: any) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const day = String(d.getDate()).padStart(2, '0');
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      let hours = d.getHours();
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${day}-${month}-${year} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    } catch {
      return String(dateStr);
    }
  };

  const formatTimeOnly = (timeStr: any) => {
    if (!timeStr) return '-';
    try {
      if (typeof timeStr === 'string' && timeStr.includes(':')) {
        const parts = timeStr.split(':');
        let hours = parseInt(parts[0], 10);
        const minutes = parts[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
      }
      const d = new Date(timeStr);
      if (!isNaN(d.getTime())) {
        let hours = d.getHours();
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
      }
      return String(timeStr);
    } catch {
      return String(timeStr);
    }
  };

  const getStatusText = () => {
    if (data.cancel_reason === 'Permit not opened so system cancelled automatically') {
      return 'Auto-Cancelled';
    }
    return data.Request_status || 'Draft';
  };

  const getFireImageUrl = (imageVal: string) => {
    if (!imageVal) return '';
    if (imageVal.startsWith('data:')) {
      return imageVal;
    }
    if (/^[A-Za-z0-9+/=]+$/.test(imageVal) && imageVal.length > 100) {
      return `data:image/png;base64,${imageVal}`;
    }
    if (imageVal.startsWith('http://') || imageVal.startsWith('https://')) {
      return imageVal;
    }
    const filename = imageVal.split('/').pop() || imageVal;
    return `/requests/${filename}`;
  };

  const getCheckImageSrc = (imageVal: string) => {
    if (!imageVal) return '';
    if (imageVal.startsWith('data:')) {
      return imageVal;
    }
    if (/^[A-Za-z0-9+/=]+$/.test(imageVal) && imageVal.length > 100) {
      return `data:image/png;base64,${imageVal}`;
    }
    if (imageVal.startsWith('http://') || imageVal.startsWith('https://')) {
      return imageVal;
    }
    const filename = imageVal.split('/').pop() || imageVal;
    return `/requests/${filename}`;
  };

  // Helper arrays for checklist loops
  const generalSafetyQuestions = [
    { id: 'affecting_other_contractors', text: 'Can you confirm that your work not affecting with other contractors working in this area before starting the work?' },
    { id: 'other_conditions', text: 'Are there other conditions that must be taken into account during the work? If Yes, note in "Other conditions"' },
    { id: 'lighting_begin_work', text: 'Can you confirm that there will be enough work lighting to begin the work?' },
    { id: 'specific_risks', text: 'Have the team been informed about the specific risks based on task? (RAMS/Toolbox talk etc.)' },
    { id: 'environment_ensured', text: 'Is the work environment safely ensured? Have the necessary warning signs been placed?' },
    { id: 'course_of_action', text: 'Have the team been informed about the course of action in any emergency situation?' }
  ];

  const hotWorkQuestions = [
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

  const weldingQuestions = [
    { id: 'heat_treatment', text: 'The people who will do heat treatment, had welder certificates?' },
    { id: 'air_extraction_be_established', text: 'Should air extraction be established? (Welding fumes directly led to open air)' }
  ];

  const electricalQuestions = [
    { id: 'responsible_for_the_informed', text: 'Is the responsible for the area informed?' },
    { id: 'de_energized', text: 'Check if the board is de-energized - is it de-energized?' },
    { id: 'do_risk_assessment', text: 'Do you have risk assessment done RAMS?' },
    { id: 'if_no_loto', text: "Secure the area against reconnection using LOTO (Lock-out/Tag-out) with at least a craftsman's padlock." },
    { id: 'electricity_have_isulation', text: 'Do appliances/devices that run on electricity have insulation?' }
  ];

  const chemicalQuestions = [
    { id: 'relevant_mal', text: 'Relevant MAL-codes and safety datasheets for hazardous medias have been presented?' },
    { id: 'msds', text: 'Is MSDS (Material Safety Data Sheet) submitted?' },
    { id: 'equipment_taken_account', text: 'Has the use of protective equipment been taken into account - and are they present?' },
    { id: 'ventilation', text: 'Has the use of ventilation been taken into account?' },
    { id: 'hazardaus_substances', text: 'Will the hazardous substances affect people outside the working area? (fumes)' },
    { id: 'storage_and_disposal', text: 'Are there means for safe storage and disposal? Is it mapped on the site plan (in case of large amount or long term storage)' },
    { id: 'reachable_case', text: 'Are the spill kits in place and reachable in case of a leak or spill?' },
    { id: 'checical_risk_assessment', text: 'Is RAMS (Risk assessment and Method statement) covering chemicals risk assessment for working with the substance?' }
  ];

  const pressureQuestions = [
    { id: 'line_walk', text: 'Linewalk of the pipework/equipment done?' },
    { id: 'pressure_test_coordinated', text: 'Pressure test is coordinated with NNE C&Q?' },
    { id: 'pipework_mic', text: 'Is the pipework/equipment MIC? (Mechanical Installation Complete)?' },
    { id: 'loto_plan_attached', text: 'LOTO plan attached to the work permit?' },
    { id: 'exclusion_zone_calculated', text: 'Is the exclusion zone calculated and layout attached to work permit?' },
    { id: 'pneumatic_hydrostatic', text: 'Pneumatic test?' },
    { id: 'pressure_of_the_test', text: 'Hydrostatic test?' },
    { id: 'safety_valves_calibrated', text: 'Safety Valves are calibrated and attached to the Pressure testing rig?' }
  ];

  const heightQuestions = [
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

  const confinedQuestions = [
    { id: 'vapours_gases', text: 'Is the tank/container cleaned so that the task can take place without risk from vapours, gases etc.?' },
    { id: 'lel_measurement', text: 'Are oxygen measurement and LEL measurement done before starting the work?' },
    { id: 'all_equipment', text: 'Are the container and all equipment on the container, including agitator properly secured?' },
    { id: 'exit_conditions', text: 'Are there safe entry and exit conditions? (e.g. ladder)' },
    { id: 'communication_emergency', text: 'Are means of communication for emergency rescue determined? (Siren, radio or telephone options)' },
    { id: 'rescue_equipments', text: 'Are rescue equipments for use in place and ready?' },
    { id: 'space_ventilation', text: 'Are space and ventilation adequate?' },
    { id: 'oxygen_meter', text: 'Is an oxygen meter provided for the work?' }
  ];

  const excavationQuestions = [
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

  const liftingQuestions = [
    { id: 'appointed_person', text: 'Is there an appointed person in charge of the lifting/crane operation?' },
    { id: 'vendor_supplier', text: 'Are the details of load (dimensions, SWL) and the loading/unloading requirements provided from vendor or supplier?' },
    { id: 'lift_plan', text: 'Is lift plan submitted?' },
    { id: 'supplied_and_inspected', text: 'Has the correct crane/lifting equipment as stated in the lift plan been supplied and inspected?' },
    { id: 'legal_required_certificates', text: 'Do the crane operators have the legal required certificates?' },
    { id: 'prapared_lifting', text: 'Is laydown area suitable and prepared for lifting?' },
    { id: 'lifting_task_fenced', text: 'Is the entire area of the lifting task fenced off?' },
    { id: 'overhead_risks', text: 'Have all overhead risks (cables, adjacent structures etc) been identified and suitable precautions implemented?' }
  ];

  const energisingElecQuestions = [
    { id: 'responsible_for_the_area', text: 'Is the responsible for the area informed?' },
    { id: 'risk_assessment_done', text: 'Do you have a risk assessment done?' },
    { id: 'barriers_signage', text: 'Barriers & Signage in place?' },
    { id: 'arc_flash', text: 'Arc flash boundary and PPE evaluated?' },
    { id: 'energized_been_tested', text: 'Have all the cables that need to be energized been tested?' },
    { id: 'punches_been_closed', text: 'Have all punches been closed?' },
    { id: 'toct_checklist', text: 'Is Electrical Checklist completed?' },
    { id: 'informed_aligned', text: 'Have you informed and aligned with EL LOTO team and provided them with an energisation request form?' }
  ];

  const isolatingElecQuestions = [
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

  const workingNearLiveQuestions = [
    { id: 'unavoidable', text: 'Live work is unavoidable and justified?' },
    { id: 'reasonably_practicable', text: 'De-energisation is not reasonably practicable?' },
    { id: 'work_authorised', text: 'Live work authorised by electrical responsible person?' },
    { id: 'working_risk_assessment', text: 'Risk assessment has been completed?' },
    { id: 'working_arc_boundary', text: 'Arc flash boundary and PPE evaluated?' },
    { id: 'working_barriers', text: 'Barriers and Signage in place?' },
    { id: 'insulated_tools', text: 'Insulated tools and approved test equipment to be used?' },
    { id: 'event_of_emergency', text: 'Work will always be carried out with a second person to assist in the event of an emergency?' }
  ];

  const mechanicalQuestions = [
    { id: 'performed_approved', text: 'Pressure test performed and approved?' },
    { id: 'flushing_approved', text: 'Flushing approved?' },
    { id: 'mc_approved', text: 'MC approved?' },
    { id: 'visual_inspection', text: 'Walkdown with Visual inspection performed?' },
    { id: 'loto_plan_approved', text: 'LOTO plan approved and installed by LOTO officer?' },
    { id: 'follow_media_code', text: 'Ensure Safety Valves follow Media Code?' },
    { id: 'cq_safety_signs', text: 'C&Q Safety signs are in place?' }
  ];

  const renderCheckRow = (question: string, val: any) => {
    const isYes = val !== undefined && val !== null && Number(val) === 1;
    const isNo = val !== undefined && val !== null && Number(val) === 0;
    const isNa = val !== undefined && val !== null && Number(val) === 2;
    return `
      <tr>
        <td>${question}</td>
        <td class="check-cell">${isYes ? '<span class="check-indicator check-yes">✓</span>' : '-'}</td>
        <td class="check-cell">${isNo ? '<span class="check-indicator check-no">✓</span>' : '-'}</td>
        <td class="check-cell">${isNa ? '<span class="check-indicator check-na">✓</span>' : '-'}</td>
      </tr>
    `;
  };

  const getRiskLevel = () => {
    if (Number(data.high_risk_hotwork) === 1) return 'High';
    if (Number(data.low_risk_hotwork) === 1) return 'Low';
    return 'High';
  };

  const getDuration = () => {
    if (!data.Start_Time || !data.End_Time) return '-';
    try {
      const parseTime = (t: string) => {
        const parts = t.split(':');
        const h = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) || 0;
        return h + m / 60;
      };
      const start = parseTime(data.Start_Time);
      const end = parseTime(data.End_Time);
      if (!isNaN(start) && !isNaN(end)) {
        let diff = end - start;
        if (diff < 0) diff += 24; // overnight
        return `${Number(diff.toFixed(2))} hrs`;
      }
    } catch {
      // ignore
    }
    return '8 hrs';
  };

  // Map status to dynamic steps list based on logs history
  const requestStatus = getStatusText();
  const logsList = (data.logs || []).filter(
    (l: any) => l.requestType && l.requestType.trim() !== 'Edited',
  );

  const findLogByType = (types: string[]) => {
    return logsList.find((l: any) =>
      types.includes(l.requestType.toLowerCase().trim()),
    );
  };

  const logDraft = findLogByType(['draft', 'created']);
  const logHold = findLogByType(['hold']);
  const logPreApproved = findLogByType(['pre-approved', 'pre_approved']);
  const logApproved = findLogByType(['approved']);
  const logOpened = findLogByType(['opened', 'open', 'opened/active']);
  const logClosed = findLogByType(['closed']);
  const logRejected = findLogByType(['rejected', 'reject']);
  const logCancelled = findLogByType(['cancelled', 'cancel']);

  // Build the list of steps for the tracking bar
  const trackingSteps: {
    label: string;
    log?: any;
    iconType: string;
  }[] = [];

  // Step 1: Draft or Hold
  const firstStepLabel = logDraft ? 'Draft' : 'Hold';
  const firstStepLog = logDraft || logHold;
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
  } else {
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
    } else {
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
  let activeStepIndex = 0;
  for (let i = 0; i < trackingSteps.length; i++) {
    if (trackingSteps[i].log) {
      activeStepIndex = i;
    }
  }

  // Percentage of progress line
  const progressPercent =
    trackingSteps.length > 1
      ? (activeStepIndex / (trackingSteps.length - 1)) * 100
      : 0;

  const getStepClass = (stepIdx: number) => {
    const step = trackingSteps[stepIdx];
    let baseClass = 'step-upcoming';
    if (activeStepIndex === stepIdx) {
      baseClass = 'step-active';
    } else if (activeStepIndex > stepIdx) {
      baseClass = 'step-completed';
    }

    if (step.label === 'Rejected') {
      return `${baseClass} step-rejected`;
    }
    if (step.label === 'Cancelled') {
      return `${baseClass} step-cancelled`;
    }
    return baseClass;
  };

  const toSvgDataUrl = (svgContent: string) => {
    const base64 = Buffer.from(svgContent.trim()).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
  };

  const locationPinDataUrl = toSvgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#64748b" stroke-width="2" width="14" height="14">
      <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  `);

  const statusIconDataUrl = toSvgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#2563eb" width="20" height="20">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
    </svg>
  `);

  const companyIconDataUrl = toSvgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#ef4444" width="20" height="20">
      <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-3a1 1 0 00-1-1H7a1 1 0 00-1 1v3a1 1 0 01-1 1H3a1 1 0 110-2V4zm2 2h4v2H6V6zm10 4h-4v2h4v-2z" clip-rule="evenodd" />
    </svg>
  `);

  const calendarIconDataUrl = toSvgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#f97316" width="20" height="20">
      <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
    </svg>
  `);

  const workersIconDataUrl = toSvgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#16a34a" width="20" height="20">
      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
    </svg>
  `);

  const durationIconDataUrl = toSvgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#64748b" width="20" height="20">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
    </svg>
  `);

  const getCardHeaderIcon = (name: string) => {
    let svgContent = '';
    if (name === 'location') {
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#475569" stroke-width="2" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`;
    } else if (name === 'tools') {
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#475569" stroke-width="2" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`;
    } else if (name === 'safety') {
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#475569" stroke-width="2" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`;
    } else if (name === 'users') {
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#475569" stroke-width="2" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`;
    } else if (name === 'hazards') {
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#dc2626" stroke-width="2" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
    } else if (name === 'check') {
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#475569" stroke-width="2" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>`;
    } else if (name === 'confirmations') {
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#475569" stroke-width="2" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>`;
    } else if (name === 'attachments') {
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#475569" stroke-width="2" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 11-2.828-2.828l6.414-6.586a4 4 0 015.656 5.656l-6.415 6.585a6 6 0 11-8.486-8.486L10.5 10" /></svg>`;
    } else if (name === 'metadata') {
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#475569" stroke-width="2" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
    } else if (name === 'hra-main') {
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#475569" stroke-width="2" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>`;
    } else if (name === 'no-hra-alert') {
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" stroke-width="2" width="48" height="48"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
    }
    return `
      <img src="${toSvgDataUrl(svgContent)}" style="width: ${name === 'hra-main' ? '24px' : '20px'}; height: ${name === 'hra-main' ? '24px' : '20px'}; display: block;" />
    `;
  };

  const getStepIconSvg = (iconType: string, color: string) => {
    switch (iconType) {
      case 'draft':
      case 'hold':
        return `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="${color}" stroke-width="2" width="20" height="20">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        `;
      case 'pre-approved':
        return `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="${color}" stroke-width="2" width="20" height="20">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        `;
      case 'approved':
        return `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="${color}" stroke-width="2" width="20" height="20">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-16 0 9 9 0 0116 0z" />
          </svg>
        `;
      case 'opened':
        return `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="${color}" stroke-width="2" width="20" height="20">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `;
      case 'closed':
        return `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="${color}" stroke-width="2" width="20" height="20">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        `;
      case 'rejected':
        return `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="${color}" stroke-width="2" width="20" height="20">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        `;
      case 'cancelled':
        return `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="${color}" stroke-width="2" width="20" height="20">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        `;
      default:
        return '';
    }
  };

  const getStepIconDataUrl = (iconType: string, color: string) => {
    const svgStr = getStepIconSvg(iconType, color);
    const base64 = Buffer.from(svgStr.trim()).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
  };

  const getStepHtml = (step: any, idx: number) => {
    const metaHtml = step.log
      ? `
        <div class="step-meta" style="font-size: 10px; color: #64748b; margin-top: 6px; line-height: 1.3; font-weight: 500; word-break: break-all; max-width: 100px;">
          <div>${formatDateTime(step.log.createdTime)}</div>
          <div style="font-weight: 600; color: #475569; margin-top: 1px;">By: ${step.log.user?.username || `User #${step.log.userId}` || ''}</div>
        </div>
      `
      : '';

    let iconColor = '#94a3b8';
    const isCompleted = activeStepIndex > idx;
    const isActive = activeStepIndex === idx;
    if (isCompleted) {
      iconColor = '#ffffff';
    } else if (isActive) {
      if (step.label === 'Rejected' || step.label === 'Cancelled') {
        iconColor = '#ffffff';
      } else {
        iconColor = '#2563eb';
      }
    }

    return `
      <div class="stepper-step ${getStepClass(idx)}">
        <div class="step-circle">
          <img src="${getStepIconDataUrl(step.iconType, iconColor)}" style="width: 20px; height: 20px; display: block;" />
        </div>
        <div class="step-label">${step.label}</div>
        ${metaHtml}
      </div>
    `;
  };

  const stepperStepsHtml = trackingSteps.map((step, idx) => getStepHtml(step, idx)).join('');

  const getStageName = () => {
    if (activeStepIndex === 0) return 'Drafting';
    if (activeStepIndex === 1) return 'Review';
    if (activeStepIndex === 2) return 'Approval';
    if (activeStepIndex === 3) return 'Execution';
    if (activeStepIndex === 4) return 'Closed';
    return 'Execution';
  };

  let activeHazardsCount = 0;
  if (Number(data.Hot_work) === 1) activeHazardsCount++;
  if (Number(data.working_on_electrical_system) === 1) activeHazardsCount++;
  if (Number(data.working_hazardious_substen) === 1) activeHazardsCount++;
  if (Number(data.pressure_testing_of_equipment) === 1) activeHazardsCount++;
  if (Number(data.working_at_height) === 1) activeHazardsCount++;
  if (Number(data.working_confined_spaces) === 1) activeHazardsCount++;
  if (Number(data.excavation_works) === 1) activeHazardsCount++;
  if (Number(data.using_cranes_or_lifting) === 1) activeHazardsCount++;
  if (Number(data.power_on) === 1) activeHazardsCount++;
  if (Number(data.pressurization) === 1) activeHazardsCount++;

  const renderPpeCard = (label: string, iconSrc: string, isRequired: boolean) => {
    const statusText = isRequired ? 'Required' : 'N/A';
    const statusClass = isRequired ? 'ppe-status-required' : 'ppe-status-na';
    const cardClass = isRequired ? 'ppe-card-active' : 'ppe-card-inactive';
    return `
      <div class="ppe-card ${cardClass}">
        <div class="ppe-badge-wrap">
          <span class="ppe-badge ${statusClass}">${statusText}</span>
        </div>
        <div class="ppe-icon-container">
          ${iconSrc ? `<img src="${iconSrc}" class="ppe-icon" alt="${label}">` : ''}
        </div>
        <div class="ppe-label">${label}</div>
      </div>
    `;
  };

  const renderActiveHazardCards = () => {
    let html = '';

    if (Number(data.Hot_work) === 1) {
      const riskLevelText = Number(data.high_risk_hotwork) === 1 ? 'High Risk' : 'Low Risk';
      const riskLevelClass = Number(data.high_risk_hotwork) === 1 ? 'text-danger' : 'text-success';

      html += `
        <div class="active-hazard-card mb-3">
          <div class="active-hazard-header">
            <div class="active-hazard-title-wrap">
              <span class="hazard-warning-icon">
                <img src="${imgHotWorks}" style="width: 24px; height: 24px; object-fit: contain; vertical-align: middle;">
              </span>
              <div>
                <div class="hazard-title">Hot Work</div>
                <div class="hazard-risk ${riskLevelClass}">${riskLevelText}</div>
              </div>
            </div>
            <div class="hazard-check-status">
              <span class="hazard-check-circle bg-green-light color-green">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 16px; height: 16px; display: inline-block;">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      `;
    }

    if (Number(data.working_on_electrical_system) === 1) {
      html += `
        <div class="active-hazard-card mb-3">
          <div class="active-hazard-header">
            <div class="active-hazard-title-wrap">
              <span class="hazard-warning-icon">
                <img src="${imgElectricalSystems}" style="width: 24px; height: 24px; object-fit: contain; vertical-align: middle;">
              </span>
              <div>
                <div class="hazard-title">Temporary Electrical Systems</div>
                <div class="hazard-risk text-warning">Electrical Risk</div>
              </div>
            </div>
            <div class="hazard-check-status">
              <span class="hazard-check-circle bg-green-light color-green">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 16px; height: 16px; display: inline-block;">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      `;
    }

    if (Number(data.working_hazardious_substen) === 1) {
      html += `
        <div class="active-hazard-card mb-3">
          <div class="active-hazard-header">
            <div class="active-hazard-title-wrap">
              <span class="hazard-warning-icon">
                <img src="${imgSubstanceChemical}" style="width: 24px; height: 24px; object-fit: contain; vertical-align: middle;">
              </span>
              <div>
                <div class="hazard-title">Hazardous Substances</div>
                <div class="hazard-risk text-danger">Chemical Risk</div>
              </div>
            </div>
            <div class="hazard-check-status">
              <span class="hazard-check-circle bg-green-light color-green">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 16px; height: 16px; display: inline-block;">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      `;
    }

    if (Number(data.working_at_height) === 1) {
      html += `
        <div class="active-hazard-card mb-3">
          <div class="active-hazard-header">
            <div class="active-hazard-title-wrap">
              <span class="hazard-warning-icon">
                <img src="${imgWorkingAtHight}" style="width: 24px; height: 24px; object-fit: contain; vertical-align: middle;">
              </span>
              <div>
                <div class="hazard-title">Working at Height</div>
                <div class="hazard-risk text-primary">Fall Risk</div>
              </div>
            </div>
            <div class="hazard-check-status">
              <span class="hazard-check-circle bg-green-light color-green">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 16px; height: 16px; display: inline-block;">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      `;
    }

    if (Number(data.working_confined_spaces) === 1) {
      html += `
        <div class="active-hazard-card mb-3">
          <div class="active-hazard-header">
            <div class="active-hazard-title-wrap">
              <span class="hazard-warning-icon">
                <img src="${imgConfinedSpace}" style="width: 24px; height: 24px; object-fit: contain; vertical-align: middle;">
              </span>
              <div>
                <div class="hazard-title">Confined Space Entry</div>
                <div class="hazard-risk text-warning">Atmosphere Risk</div>
              </div>
            </div>
            <div class="hazard-check-status">
              <span class="hazard-check-circle bg-green-light color-green">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 16px; height: 16px; display: inline-block;">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      `;
    }

    if (Number(data.pressure_testing_of_equipment) === 1) {
      html += `
        <div class="active-hazard-card mb-3">
          <div class="active-hazard-header">
            <div class="active-hazard-title-wrap">
              <span class="hazard-warning-icon">
                <img src="${imgTestingEquipment}" style="width: 24px; height: 24px; object-fit: contain; vertical-align: middle;">
              </span>
              <div>
                <div class="hazard-title">Pressure Testing of Equipment</div>
                <div class="hazard-risk text-warning">Pressure Risk</div>
              </div>
            </div>
            <div class="hazard-check-status">
              <span class="hazard-check-circle bg-green-light color-green">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 16px; height: 16px; display: inline-block;">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      `;
    }

    if (Number(data.excavation_works) === 1) {
      html += `
        <div class="active-hazard-card mb-3">
          <div class="active-hazard-header">
            <div class="active-hazard-title-wrap">
              <span class="hazard-warning-icon">
                <img src="${imgExcavationWorks}" style="width: 24px; height: 24px; object-fit: contain; vertical-align: middle;">
              </span>
              <div>
                <div class="hazard-title">Excavation Works</div>
                <div class="hazard-risk text-danger">Ground Risk</div>
              </div>
            </div>
            <div class="hazard-check-status">
              <span class="hazard-check-circle bg-green-light color-green">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 16px; height: 16px; display: inline-block;">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      `;
    }

    if (Number(data.using_cranes_or_lifting) === 1) {
      html += `
        <div class="active-hazard-card mb-3">
          <div class="active-hazard-header">
            <div class="active-hazard-title-wrap">
              <span class="hazard-warning-icon">
                <img src="${imgCranesLifting}" style="width: 24px; height: 24px; object-fit: contain; vertical-align: middle;">
              </span>
              <div>
                <div class="hazard-title">Cranes &amp; Lifting</div>
                <div class="hazard-risk text-danger">Lifting Risk</div>
              </div>
            </div>
            <div class="hazard-check-status">
              <span class="hazard-check-circle bg-green-light color-green">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 16px; height: 16px; display: inline-block;">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      `;
    }

    if (Number(data.power_on) === 1) {
      html += `
        <div class="active-hazard-card mb-3">
          <div class="active-hazard-header">
            <div class="active-hazard-title-wrap">
              <span class="hazard-warning-icon">
                <img src="${imgElectricalWorks}" style="width: 24px; height: 24px; object-fit: contain; vertical-align: middle;">
              </span>
              <div>
                <div class="hazard-title">Electrical Works</div>
                <div class="hazard-risk text-warning">Electrical Risk</div>
              </div>
            </div>
            <div class="hazard-check-status">
              <span class="hazard-check-circle bg-green-light color-green">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 16px; height: 16px; display: inline-block;">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      `;
    }

    if (Number(data.pressurization) === 1) {
      html += `
        <div class="active-hazard-card mb-3">
          <div class="active-hazard-header">
            <div class="active-hazard-title-wrap">
              <span class="hazard-warning-icon">
                <img src="${imgMechanicalWorks}" style="width: 24px; height: 24px; object-fit: contain; vertical-align: middle;">
              </span>
              <div>
                <div class="hazard-title">Mechanical Works</div>
                <div class="hazard-risk text-primary">Mechanical Risk</div>
              </div>
            </div>
            <div class="hazard-check-status">
              <span class="hazard-check-circle bg-green-light color-green">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 16px; height: 16px; display: inline-block;">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      `;
    }

    if (html === '') {
      html = '<p class="text-muted">No active hazard checklists.</p>';
    }
    return html;
  };

  // Compile complex map loops to safe HTML variables BEFORE starting the return string literal
  const attachmentsHtml = data.files && data.files.length > 0
    ? data.files.map((file: any) => {
      const filename = file.ramsFile ? file.ramsFile.split('/').pop() : 'Attachment';
      return `
          <a href="/requests/files/${file.ramsFileId}" download class="attachment-box">
            <div class="attachment-icon-wrap">
              <svg class="attachment-file-icon text-danger" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="attachment-details">
              <span class="attachment-name">${filename}</span>
              <span class="attachment-size">Click to download</span>
            </div>
            <div class="attachment-download-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 18px; height: 18px; color: #64748b;">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </a>
        `;
    }).join('')
    : '<p class="text-muted">No attachments.</p>';

  const imagesHtml = data.images && data.images.length > 0
    ? data.images.map((img: any, index: number) => `
        <div class="col-md-3 mb-3">
          <a href="#myModal${index}" class="btn p-0" data-toggle="modal">
            <img src="${getCheckImageSrc(img.imageName)}" class="img-thumbnail" style="width:100%; height:120px; object-fit:cover;">
          </a>
          
          <div class="modal fade" id="myModal${index}" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Enlarged Image</h5>
                  <button type="button" class="close" data-toggle="modal" aria-hidden="true">&times;</button>
                </div>
                <div class="modal-body text-center">
                  <img src="${getCheckImageSrc(img.imageName)}" style="max-width:100%; height:auto;">
                </div>
              </div>
            </div>
          </div>
        </div>
      `).join('')
    : '<p class="text-muted">No images uploaded.</p>';

  const notesHtml = data.note && data.note.length > 0
    ? `
      <div class="mt-3">
        <div class="info-label">System Notes</div>
        <table class="compact-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            ${data.note.map((n: any) => `
              <tr>
                <td style="width: 120px;">${n.username || 'System'}</td>
                <td>${n.note || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `
    : '';

  const conm = data.ConM_initials || 'N/A';
  const comm = data.CoMM_initials || 'N/A';
  const pType = data.permit_type;
  const pUnder = data.permit_under;
  let approvalsHtml = '';
  if (pType === 'Construction' && pUnder === 'Construction') {
    approvalsHtml = `<div class="info-label">ConM initials</div><div class="info-value mb-2">${conm}</div>`;
  } else if (pType === 'Construction' && pUnder === 'Commissioning') {
    approvalsHtml = `<div class="info-label">ConM initials</div><div class="info-value mb-2">${conm}</div><div class="info-label">C&Q initials</div><div class="info-value mb-2">${comm}</div>`;
  } else if (pType === 'Commissioning' && pUnder === 'Construction') {
    approvalsHtml = `<div class="info-label">C&Q initials</div><div class="info-value mb-2">${comm}</div><div class="info-label">ConM initials</div><div class="info-value mb-2">${conm}</div>`;
  } else if (pType === 'Commissioning' && pUnder === 'Commissioning') {
    approvalsHtml = `<div class="info-label">C&Q initials</div><div class="info-value mb-2">${comm}</div>`;
  } else {
    approvalsHtml = `<div class="info-label">ConM initials</div><div class="info-value mb-2">${conm}</div>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Activity Permit Details</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body {
      background-color: #f1f5f9; /* Modern light-grey theme */
      margin: 0;
      padding: 0;
      font-family: 'Mulish', sans-serif;
      color: #1e293b;
    }
    .permit-container {
      max-width: 1280px;
      margin: 32px auto;
      padding: 0 16px;
    }
    .dashboard-card {
      background: #ffffff;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025);
      padding: 24px;
      margin-bottom: 24px;
      position: relative;
    }
    .card-section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .card-section-title-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .card-section-icon {
      color: #3b82f6;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card-section-title {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }
    .card-section-subtitle {
      font-size: 13px;
      color: #64748b;
      margin: 4px 0 0 0;
    }
    .header-layout {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 16px;
    }
    .header-title-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .back-btn {
      color: #475569;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      transition: all 0.2s;
      cursor: pointer;
    }
    .back-btn:hover {
      background: #e2e8f0;
      color: #0f172a;
    }
    .header-details-wrap {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .permit-title {
      font-size: 26px;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
    }
    .badge-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .header-badge {
      font-size: 12px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 9999px;
      background-color: #e2e8f0;
      color: #475569;
    }
    .header-badge.badge-risk {
      background-color: #fee2e2;
      color: #dc2626;
    }
    .header-badge.badge-status {
      background-color: #d1fae5;
      color: #065f46;
    }
    .location-pin-text {
      font-size: 13px;
      color: #64748b;
      font-weight: 600;
      display: inline-block;
      vertical-align: middle;
      word-wrap: break-word;
      word-break: break-word;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .btn-action {
      font-size: 14px;
      font-weight: 700;
      padding: 8px 16px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
      color: #334155;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .btn-action:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }
    .btn-action.btn-primary-action {
      background: #2563eb;
      color: #ffffff;
      border-color: #2563eb;
    }
    .btn-action.btn-primary-action:hover {
      background: #1d4ed8;
    }
    .triple-dots {
      color: #94a3b8;
      cursor: pointer;
      padding: 8px;
      font-size: 18px;
    }
    
    /* Stepper styles */
    .stepper-container {
      position: relative;
      margin: 32px 0 8px 0;
      padding: 0 40px;
    }
    .stepper-line {
      position: absolute;
      top: 20px;
      left: 95px;
      right: 95px;
      height: 4px;
      background-color: #e2e8f0;
      z-index: 1;
      border-radius: 2px;
    }
    .stepper-line-progress {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background-color: #3b82f6;
      transition: width 0.4s ease;
    }
    .stepper-steps {
      display: flex;
      justify-content: space-between;
      position: relative;
      z-index: 2;
    }
    .stepper-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      width: 110px;
    }
    .step-circle {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background-color: #ffffff;
      border: 3px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      margin-bottom: 8px;
      transition: all 0.3s ease;
    }
    .step-circle svg {
      width: 20px;
      height: 20px;
    }
    .step-label {
      font-size: 13px;
      font-weight: 600;
      color: #64748b;
      transition: color 0.3s ease;
    }
    .step-completed .step-circle {
      background-color: #2563eb;
      border-color: #2563eb;
      color: #ffffff;
      box-shadow: 0 4px 10px rgba(37, 99, 235, 0.15);
    }
    .step-completed .step-label {
      color: #1e293b;
      font-weight: 700;
    }
    .step-active .step-circle {
      background-color: #ffffff;
      border-color: #2563eb;
      color: #2563eb;
      box-shadow: 0 0 0 5px rgba(37, 99, 235, 0.15), 0 4px 10px rgba(37, 99, 235, 0.2);
    }
    .step-active .step-label {
      color: #2563eb;
      font-weight: 800;
    }
    .step-upcoming .step-circle {
      background-color: #f8fafc;
      border-color: #e2e8f0;
      color: #94a3b8;
    }

    /* Rejected State Style */
    .step-completed.step-rejected .step-circle,
    .step-active.step-rejected .step-circle {
      background-color: #ef4444 !important;
      border-color: #ef4444 !important;
      color: #ffffff !important;
      box-shadow: 0 4px 10px rgba(239, 68, 68, 0.2) !important;
    }
    .step-completed.step-rejected .step-label,
    .step-active.step-rejected .step-label {
      color: #ef4444 !important;
    }

    /* Cancelled State Style */
    .step-completed.step-cancelled .step-circle,
    .step-active.step-cancelled .step-circle {
      background-color: #f97316 !important;
      border-color: #f97316 !important;
      color: #ffffff !important;
      box-shadow: 0 4px 10px rgba(249, 115, 22, 0.2) !important;
    }
    .step-completed.step-cancelled .step-label,
    .step-active.step-cancelled .step-label {
      color: #f97316 !important;
    }

    /* Stats Grid */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .stats-card {
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }
    .stats-icon-wrap {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .stats-icon {
      width: 20px;
      height: 20px;
    }
    .stats-info {
      display: flex;
      flex-direction: column;
    }
    .stats-label {
      font-size: 11px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .stats-value {
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
    }
    .bg-blue-light { background-color: #eff6ff; }
    .color-blue { color: #3b82f6; fill: #3b82f6; }
    .text-blue { color: #2563eb; }
    .bg-red-light { background-color: #fef2f2; }
    .color-red { color: #ef4444; fill: #ef4444; }
    .text-red { color: #dc2626; }
    .bg-orange-light { background-color: #fff7ed; }
    .color-orange { color: #f97316; fill: #f97316; }
    .text-orange { color: #ea580c; }
    .bg-green-light { background-color: #f0fdf4; }
    .color-green { color: #22c55e; fill: #22c55e; }
    .text-green { color: #16a34a; }
    .bg-grey-light { background-color: #f8fafc; }
    .color-grey { color: #64748b; fill: #64748b; }
    .text-grey { color: #475569; }
    .bg-purple-light { background-color: #faf5ff; }
    .color-purple { color: #a855f7; fill: #a855f7; }
    .text-purple { color: #7c3aed; }

    /* Columns Layout */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 4fr 5fr;
      gap: 24px;
    }
    @media (max-width: 992px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Key-Value styling */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px 24px;
    }
    .info-label {
      font-size: 11px;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .info-value {
      font-size: 15px;
      font-weight: 600;
      color: #1e293b;
      word-wrap: break-word;
    }
    .info-fullwidth {
      grid-column: 1 / -1;
    }

    /* Precautions Card style */
    .precautions-card {
      border-left: 4px solid #f97316;
      background-color: #fffaf8;
      padding: 16px;
      border-radius: 0 12px 12px 0;
      margin-bottom: 16px;
    }
    .precautions-content {
      font-size: 14px;
      line-height: 1.6;
      color: #334155;
    }
    .precautions-content ul {
      margin: 0;
      padding-left: 20px;
    }

    /* Attendees and Signatures styling */
    .compact-table {
      width: 100%;
      border-collapse: collapse;
    }
    .compact-table th {
      text-align: left;
      font-size: 11px;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      padding-bottom: 8px;
      border-bottom: 1px solid #cbd5e1;
    }
    .compact-table td {
      padding: 10px 0;
      border-bottom: 1px solid #f1f5f9;
      font-size: 13px;
      font-weight: 600;
      color: #334155;
    }
    .compact-table tr:last-child td {
      border-bottom: none;
    }

    /* Active Hazard card */
    .active-hazard-card {
      background-color: #fef2f2;
      border: 1px solid #fee2e2;
      border-radius: 12px;
      padding: 16px;
    }
    .active-hazard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .active-hazard-title-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .hazard-warning-icon {
      display: flex;
      align-items: center;
    }
    .hazard-title {
      font-size: 15px;
      font-weight: 700;
      color: #0f172a;
    }
    .hazard-risk {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      margin-top: 2px;
    }
    .hazard-check-status {
      display: flex;
      align-items: center;
    }
    .hazard-check-circle {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .active-hazard-checks {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-left: 30px;
    }
    .hazard-checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 600;
      color: #475569;
      cursor: default;
      margin: 0;
    }
    .hazard-checkbox-label input[type="checkbox"] {
      display: none;
    }
    .checkbox-custom {
      width: 16px;
      height: 16px;
      border-radius: 4px;
      border: 2px solid #cbd5e1;
      background-color: #ffffff;
      display: inline-block;
      position: relative;
    }
    .hazard-checkbox-label input[type="checkbox"]:checked + .checkbox-custom {
      background-color: #2563eb;
      border-color: #2563eb;
    }
    .hazard-checkbox-label input[type="checkbox"]:checked + .checkbox-custom:after {
      content: "";
      position: absolute;
      left: 4px;
      top: 1px;
      width: 4px;
      height: 8px;
      border: solid #ffffff;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    /* PPE grid styling */
    .ppe-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
      gap: 12px;
      margin-top: 12px;
    }
    .ppe-card {
      border-radius: 12px;
      padding: 12px;
      text-align: center;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      min-height: 100px;
    }
    .ppe-card-active {
      background-color: #eff6ff;
      border: 1px solid #3b82f6;
      color: #1e293b;
    }
    .ppe-card-inactive {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      color: #94a3b8;
      opacity: 0.6;
    }
    .ppe-badge-wrap {
      position: absolute;
      top: -6px;
      right: 8px;
    }
    .ppe-badge {
      font-size: 8px;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .ppe-status-required {
      background-color: #2563eb;
      color: #ffffff;
    }
    .ppe-status-na {
      background-color: #cbd5e1;
      color: #475569;
    }
    .ppe-icon-container {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 6px;
    }
    .ppe-icon {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    .ppe-label {
      font-size: 11px;
      font-weight: 700;
    }

    /* Confirmations listing */
    .confirmation-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 14px;
      background-color: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 8px;
      margin-bottom: 8px;
    }
    .confirmation-row:last-child {
      margin-bottom: 0;
    }
    .confirmation-label {
      font-size: 13px;
      font-weight: 600;
      color: #1e293b;
    }
    .confirmation-badge {
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .badge-yes {
      background-color: #d1fae5;
      color: #065f46;
    }
    .badge-no {
      background-color: #fee2e2;
      color: #991b1b;
    }

    /* Attachments download row */
    .attachments-grid {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .attachment-box {
      display: flex;
      align-items: center;
      gap: 10px;
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 12px;
      text-decoration: none !important;
      transition: all 0.2s ease;
    }
    .attachment-box:hover {
      background-color: #f1f5f9;
      border-color: #cbd5e1;
    }
    .attachment-icon-wrap {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .attachment-file-icon {
      width: 20px;
      height: 20px;
    }
    .attachment-details {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      overflow: hidden;
    }
    .attachment-name {
      font-size: 12px;
      font-weight: 700;
      color: #1e293b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .attachment-size {
      font-size: 10px;
      color: #94a3b8;
    }
    .attachment-download-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Metadata Row styling */
    .metadata-rows {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .metadata-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px dashed #f1f5f9;
      padding-bottom: 8px;
    }
    .metadata-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .metadata-label {
      font-size: 12px;
      color: #64748b;
      font-weight: 600;
    }
    .metadata-value {
      font-size: 12px;
      font-weight: 700;
      color: #0f172a;
    }

    /* Bottom checklists HRA section styling */
    .detailed-section-title {
      font-size: 16px;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 12px;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 8px;
      display: flex;
      align-items: center;
    }
    .detailed-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
    }
    .detailed-table th {
      background-color: #f8fafc;
      color: #475569;
      font-weight: 700;
      font-size: 12px;
      padding: 10px 14px;
      border-bottom: 1px solid #e2e8f0;
    }
    .detailed-table td {
      padding: 10px 14px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 13px;
      color: #334155;
    }
    .check-cell {
      text-align: center;
      width: 50px;
      padding: 10px 0 !important;
    }
    .check-indicator {
      font-weight: 800;
      font-size: 14px;
    }
    .check-yes { color: #16a34a; }
    .check-no { color: #dc2626; }
    .check-na { color: #64748b; }

    /* Footer buttons */
    .confirm-pg-download-container {
      text-align: center;
      margin-top: 32px;
      padding-bottom: 40px;
    }
    .confirm-pg-download-btn {
      background: #2563eb;
      color: #ffffff;
      padding: 12px 32px;
      border-radius: 8px;
      border: none;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(37, 99, 235, 0.15);
      transition: all 0.2s;
    }
    .confirm-pg-download-btn:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
    }
    
    @media print {
      body {
        background-color: #ffffff;
        color: #000000;
      }
      .permit-container {
        margin: 0;
        padding: 0;
        max-width: 100%;
      }
      .dashboard-card {
        box-shadow: none;
        border: 1px solid #cbd5e1;
        page-break-inside: avoid;
      }
      .confirm-pg-download-container {
        display: none;
      }
      .back-btn {
        display: none;
      }
    }
  </style>
</head>
<body>

  <div class="permit-container" id="root">
    
    <!-- Top Dashboard Card (Header, Actions, Stepper) -->
    <div class="dashboard-card">
      <div class="header-layout" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: nowrap; gap: 16px; width: 100%;">
        <div class="header-title-section" style="display: flex; align-items: center; gap: 16px; min-width: 0; flex-grow: 1;">
          <div class="back-btn" onclick="window.history.back()" style="flex-shrink: 0;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 20px; height: 20px;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          <div class="header-details-wrap" style="min-width: 0; flex-grow: 1;">
            <h1 class="permit-title" style="margin: 0;">Permit #${data.PermitNo || '-'}</h1>
            <div class="badge-row" style="margin-top: 4px;">
              <span class="header-badge">${data.activityName || data.Activity || 'Activity'}</span>
              <span class="header-badge badge-risk">${getRiskLevel()} Risk</span>
              <span class="header-badge badge-status">${getStatusText()}</span>
              <span class="location-pin-text" style="display: inline-block; vertical-align: middle;">
                <img src="${locationPinDataUrl}" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle; margin-right: 4px;" />
                <span style="vertical-align: middle;">${formatRooms(data.room_names || data.Room_Nos || data.zone_name)}</span>
              </span>
            </div>
          </div>
        </div>
        <div class="header-actions" style="flex-shrink: 0; display: flex; align-items: center; gap: 10px;">
          <button class="btn-action" onclick="test()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 16px; height: 16px;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            PDF
          </button>
          <div class="triple-dots" style="padding: 8px;">&#8942;</div>
        </div>
      </div>
      
      <!-- Stepper Widget -->
      <div class="stepper-container">
        <div class="stepper-line">
          <div class="stepper-line-progress" style="width: ${progressPercent}%;"></div>
        </div>
        <div class="stepper-steps">
          ${stepperStepsHtml}
        </div>
      </div>
    </div>

    <!-- Statistics Row Widget -->
    <div class="stats-row">
      <div class="stats-card">
        <div class="stats-icon-wrap bg-blue-light">
          <img src="${statusIconDataUrl}" style="width: 20px; height: 20px; display: block;" />
        </div>
        <div class="stats-info">
          <div class="stats-label">Status</div>
          <div class="stats-value text-blue">${getStatusText()}</div>
        </div>
      </div>
      <div class="stats-card">
        <div class="stats-icon-wrap bg-red-light">
          <img src="${companyIconDataUrl}" style="width: 20px; height: 20px; display: block;" />
        </div>
        <div class="stats-info">
          <div class="stats-label">Contractor</div>
          <div class="stats-value text-red" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 110px;">
            ${data.subContractorName || data.Company_Name || '-'}
          </div>
        </div>
      </div>
      <div class="stats-card">
        <div class="stats-icon-wrap bg-orange-light">
          <img src="${calendarIconDataUrl}" style="width: 20px; height: 20px; display: block;" />
        </div>
        <div class="stats-info">
          <div class="stats-label">Date</div>
          <div class="stats-value text-orange">${formatDateOnly(data.Working_Date)}</div>
        </div>
      </div>
      <div class="stats-card">
        <div class="stats-icon-wrap bg-green-light">
          <img src="${workersIconDataUrl}" style="width: 20px; height: 20px; display: block;" />
        </div>
        <div class="stats-info">
          <div class="stats-label">Workers</div>
          <div class="stats-value text-green">${data.Number_Of_Workers || '0'}</div>
        </div>
      </div>
      <div class="stats-card">
        <div class="stats-icon-wrap bg-grey-light">
          <img src="${durationIconDataUrl}" style="width: 20px; height: 20px; display: block;" />
        </div>
        <div class="stats-info">
          <div class="stats-label">Duration</div>
          <div class="stats-value text-grey">${getDuration()}</div>
        </div>
      </div>
    </div>

    <!-- Two Column Dashboard Grid -->
    <div class="dashboard-grid">
      
      <!-- Left Column -->
      <div>

        <!-- Check-in & Check-out Status (Moved here, above Location & Schedule) -->
        ${(data.check_in_time || (data.Request_status === 'Closed' && data.check_out_time)) ? `
          <div class="row mb-1">
            ${data.check_in_time ? `
              <div class="col-md-6 mb-3">
                <div class="dashboard-card mb-0" style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px;">
                  <div class="info-label" style="color: #15803d; font-size: 11px;">Checked In</div>
                  <div class="info-value mb-2" style="color: #166534; font-size: 14px;">${formatDateTime(data.check_in_time)}</div>
                  <div class="info-label" style="color: #15803d; font-size: 10px;">User</div>
                  <div class="info-value" style="color: #166534; font-size: 13px;">${data.check_in_user || '-'}</div>
                </div>
              </div>
            ` : ''}
            ${(data.Request_status === 'Closed' && data.check_out_time) ? `
              <div class="col-md-6 mb-3">
                <div class="dashboard-card mb-0" style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 16px;">
                  <div class="info-label" style="color: #b91c1c; font-size: 11px;">Checked Out</div>
                  <div class="info-value mb-2" style="color: #991b1b; font-size: 14px;">${formatDateTime(data.check_out_time)}</div>
                  <div class="info-label" style="color: #b91c1c; font-size: 10px;">User</div>
                  <div class="info-value" style="color: #991b1b; font-size: 13px;">${data.check_out_user || '-'}</div>
                </div>
              </div>
            ` : ''}
          </div>
        ` : ''}
        
        <!-- Location & Schedule -->
        <div class="dashboard-card">
          <div class="card-section-header">
            <div class="card-section-title-wrap">
              <span class="card-section-icon">
                ${getCardHeaderIcon('location')}
              </span>
              <div>
                <h2 class="card-section-title">Location & Schedule</h2>
                <p class="card-section-subtitle">Where and when the work occurs</p>
              </div>
            </div>
          </div>
          <div class="info-grid">
            <div>
              <div class="info-label">Building</div>
              <div class="info-value">${data.building_name || '-'}</div>
            </div>
            <div>
              <div class="info-label">Level</div>
              <div class="info-value">${data.Room_Type || '-'}</div>
            </div>
            <div>
              <div class="info-label">Zone</div>
              <div class="info-value">${data.zone_name || '-'}</div>
            </div>
            <div>
              <!-- Empty spacer to align the grid -->
            </div>
            <div class="info-fullwidth">
              <div class="info-label">Specific Rooms</div>
              <div class="info-value">${formatRooms(data.room_names || data.Room_Nos)}</div>
            </div>
            <div>
              <div class="info-label">Date</div>
              <div class="info-value">${formatDateOnly(data.Working_Date)}</div>
            </div>
            <div>
              <div class="info-label">Time</div>
              <div class="info-value">${formatTimeOnly(data.Start_Time)} - ${formatTimeOnly(data.End_Time)}</div>
            </div>
            <div>
              <div class="info-label">Shift Type</div>
              <div class="info-value">${Number(data.night_shift) === 1 ? 'Night Shift' : 'Day Shift'}</div>
            </div>
          </div>
        </div>

        <!-- Work Details & Resources -->
        <div class="dashboard-card">
          <div class="card-section-header">
            <div class="card-section-title-wrap">
              <span class="card-section-icon">
                ${getCardHeaderIcon('tools')}
              </span>
              <div>
                <h2 class="card-section-title">Work Details & Resources</h2>
                <p class="card-section-subtitle">Contractors, tools, and machinery</p>
              </div>
            </div>
          </div>
          <div class="info-grid">
            <div class="info-fullwidth">
              <div class="info-label">Description of Activity</div>
              <div class="info-value" style="font-weight: 700; color: #0f172a; margin-bottom: 8px;">${data.description_of_activity || data.descriptionOfActivity || '-'}</div>
            </div>
            <div>
              <div class="info-label">Contractor</div>
              <div class="info-value">${data.subContractorName || data.Company_Name || '-'}</div>
            </div>
            <div>
              <div class="info-label">Supervisor</div>
              <div class="info-value">${data.Foreman || '-'}</div>
            </div>
            <div class="info-fullwidth">
              <div class="info-label">Tools Used</div>
              <div class="info-value">${data.Tools || '-'}</div>
            </div>
            <div class="info-fullwidth">
              <div class="info-label">Machinery Used</div>
              <div class="info-value">${data.Machinery || '-'}</div>
            </div>
          </div>
        </div>

        <!-- Safety Precautions & Notes -->
        <div class="dashboard-card">
          <div class="card-section-header">
            <div class="card-section-title-wrap">
              <span class="card-section-icon">
                ${getCardHeaderIcon('safety')}
              </span>
              <div>
                <h2 class="card-section-title">Safety Precautions & Notes</h2>
                <p class="card-section-subtitle">Special instructions for this task</p>
              </div>
            </div>
          </div>
          
          ${data.resolvedPrecautions && data.resolvedPrecautions.length > 0 ? `
            <div class="precautions-card">
              <div class="precautions-content">
                <ul>
                  ${data.resolvedPrecautions.map((p: string) => `<li>${p}</li>`).join('')}
                </ul>
              </div>
            </div>
          ` : ''}

          ${notesHtml}
        </div>


      </div>

      <!-- Right Column -->
      <div>
        
        <!-- Active Hazards -->
        <div class="dashboard-card">
          <div class="card-section-header">
            <div class="card-section-title-wrap">
              <span class="card-section-icon">
                ${getCardHeaderIcon('hazards')}
              </span>
              <div>
                <h2 class="card-section-title">Active Hazards</h2>
                <p class="card-section-subtitle">Identified risks for this permit</p>
              </div>
            </div>
          </div>
          <div class="active-hazards-list">
            ${renderActiveHazardCards()}
          </div>
        </div>

        <!-- Required PPE -->
        <div class="dashboard-card">
          <div class="card-section-header">
            <div class="card-section-title-wrap">
              <span class="card-section-icon">
                ${getCardHeaderIcon('check')}
              </span>
              <div>
                <h2 class="card-section-title">Required PPE</h2>
                <p class="card-section-subtitle">Mandatory safety equipment</p>
              </div>
            </div>
          </div>
          <div class="ppe-grid">
            ${renderPpeCard('Eye Protection', imgEyeProtection, Number(data.eye_protection) === 1)}
            ${renderPpeCard('Fall Protection', imgFallProtection, Number(data.fall_protection) === 1)}
            ${renderPpeCard('Hearing Protection', imgHearingProtection, Number(data.hearing_protection) === 1)}
            ${renderPpeCard('Respiratory Protection', imgRespiratoryProtection, Number(data.respiratory_protection) === 1)}
          </div>
          ${data.other_ppe ? `
            <div class="mt-3">
              <div class="info-label">Other PPE</div>
              <div class="info-value">${data.other_ppe}</div>
            </div>
          ` : ''}
        </div>



        <!-- Attachments -->
        <div class="dashboard-card">
          <div class="card-section-header">
            <div class="card-section-title-wrap">
              <span class="card-section-icon">
                ${getCardHeaderIcon('attachments')}
              </span>
              <div>
                <h2 class="card-section-title">Attachments</h2>
                <p class="card-section-subtitle">Documents and images</p>
              </div>
            </div>
          </div>
          <div class="attachments-grid">
            ${attachmentsHtml}
          </div>
        </div>

        <!-- Metadata -->
        <div class="dashboard-card">
          <div class="card-section-header">
            <div class="card-section-title-wrap">
              <span class="card-section-icon">
                ${getCardHeaderIcon('metadata')}
              </span>
              <div>
                <h2 class="card-section-title">Metadata</h2>
                <p class="card-section-subtitle">System tracking details</p>
              </div>
            </div>
          </div>
          <div class="metadata-rows">
            <div class="metadata-row">
              <span class="metadata-label">Created By:</span>
              <span class="metadata-value">System / ${data.created_by_user || 'Alex Mercer'}</span>
            </div>
            <div class="metadata-row">
              <span class="metadata-label">Created Date:</span>
              <span class="metadata-value">${formatDateOnly(data.Request_Date)}</span>
            </div>
            <div class="metadata-row">
              <span class="metadata-label">Last Updated:</span>
              <span class="metadata-value">${formatDateOnly(data.createdTime || data.Request_Date)}</span>
            </div>
            <div class="metadata-row">
              <span class="metadata-label">Owner:</span>
              <span class="metadata-value">${data.subContractorName || data.Company_Name || 'Apex Construction'}</span>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- HRA Detailed Checklists Section (Appended at the bottom) -->
    <div class="mt-4 pt-4 border-top">
      
      <div class="d-flex align-items-center gap-2 mb-4">
        ${getCardHeaderIcon('hra-main')}
        <h3 style="font-weight: 800; font-size: 20px; color: #334155; margin: 0; display: inline-block; vertical-align: middle;">Hazard Risk Assessments (HRAs) & Detailed Checklists</h3>
      </div>

      <!-- If no HRAs are active, show a clean 'No HRAs' notice at the bottom -->
      ${activeHazardsCount === 0 ? `
        <div class="dashboard-card text-center" style="padding: 32px; background-color: #f8fafc; border: 1px dashed #cbd5e1; margin-bottom: 24px;">
          ${getCardHeaderIcon('no-hra-alert')}
          <div style="font-size: 16px; font-weight: 700; color: #64748b; margin-top: 12px;">No Hazard Risk Assessments (HRAs) Active</div>
          <div style="font-size: 13px; color: #94a3b8; margin-top: 4px;">This permit does not require high-risk checklist controls.</div>
        </div>
      ` : ''}

      <!-- General Safety Checklist Detailed Table -->
      <div class="dashboard-card">
        <div class="detailed-section-title">
          General Safety Questions
        </div>
        <table class="detailed-table">
          <thead>
            <tr>
              <th>Question</th>
              <th class="check-cell">Yes</th>
              <th class="check-cell">No</th>
              <th class="check-cell">N/A</th>
            </tr>
          </thead>
          <tbody>
            ${generalSafetyQuestions.map(q => renderCheckRow(q.text, data[q.id])).join('')}
            ${Number(data.other_conditions) === 1 ? `
              <tr>
                <td colspan="4" class="text-danger font-weight-bold">
                  <strong>Other Conditions Input:</strong> ${data.other_conditions_input || '-'}
                </td>
              </tr>
            ` : ''}
          </tbody>
        </table>
      </div>

      <!-- Hotwork Checklist Table -->
      ${(() => {
      const isHotWorkActive = Number(data.Hot_work) === 1;
      const isWeldingActive = isHotWorkActive && Number(data.welding_activitiy) === 1;
      if (!isHotWorkActive) {
        return `
          <div class="dashboard-card" style="border-left: 4px solid #ef4444; background-color: #fafafa; opacity: 0.9;">
            <div class="detailed-section-title" style="margin-bottom: 0; border-bottom: none; padding-bottom: 0; display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <div style="display: flex; align-items: center;">
                ${imgHotWorks ? `<img src="${imgHotWorks}" style="height: 32px; vertical-align: middle; margin-right: 8px;">` : ''}
                <span style="color: #64748b;">Hotwork Checklist</span>
              </div>
              <span class="badge" style="background-color: #fee2e2; color: #ef4444; border: 1px solid #fecaca; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;">No</span>
            </div>
          </div>
        `;
      }
      return `
        <div class="dashboard-card" style="border-left: 4px solid #16a34a;">
          <div class="detailed-section-title" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center;">
              ${imgHotWorks ? `<img src="${imgHotWorks}" style="height: 32px; vertical-align: middle; margin-right: 8px;">` : ''}
              Hotwork Checklist
            </div>
            <span class="badge" style="background-color: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;">Yes</span>
          </div>
          <table class="detailed-table">
            <thead>
              <tr>
                <th>Question</th>
                <th class="check-cell">Yes</th>
                <th class="check-cell">No</th>
                <th class="check-cell">N/A</th>
              </tr>
            </thead>
            <tbody>
              ${hotWorkQuestions.map(q => renderCheckRow(q.text, data[q.id])).join('')}
            </tbody>
          </table>

          <div class="row mt-3">
            <div class="col-md-6">
              <div class="info-label">Is there any welding activity?</div>
              <div class="info-value">${isWeldingActive ? 'Yes' : 'No'}</div>
            </div>
            <div class="col-md-6">
              <table class="detailed-table">
                <thead>
                  <tr>
                    <th>Welding Question</th>
                    <th class="check-cell">Yes</th>
                    <th class="check-cell">No</th>
                    <th class="check-cell">N/A</th>
                  </tr>
                </thead>
                <tbody>
                  ${weldingQuestions.map(q => renderCheckRow(q.text, isWeldingActive ? data[q.id] : 0)).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-6">
              <div class="info-grid">
                <div>
                  <div class="info-label">Low Risk Hotwork</div>
                  <div class="info-value">${Number(data.low_risk_hotwork) === 1 ? 'Yes' : 'No'}</div>
                </div>
                <div>
                  <div class="info-label">High Risk Hotwork</div>
                  <div class="info-value">${Number(data.high_risk_hotwork) === 1 ? 'Yes' : 'No'}</div>
                </div>
                <div>
                  <div class="info-label">Hot Work Checklist Filled</div>
                  <div class="info-value">${Number(data.hot_work_checklist_filled) === 1 ? 'Yes' : 'No'}</div>
                </div>
                <div>
                  <div class="info-label">Fire Guard Present</div>
                  <div class="info-value">${Number(data.fire_guard_present) === 1 ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </div>
            <div class="col-md-6 text-center">
              ${data.fire_image ? `
                <div class="info-label">Fire Watch Image</div>
                <img src="${getFireImageUrl(data.fire_image)}" style="max-width: 140px; height: auto; border-radius: 8px; border: 1px solid #cbd5e1; margin-top: 8px;">
              ` : ''}
            </div>
          </div>

          <div class="mt-4 border-top pt-3">
            <table class="detailed-table">
              <tbody>
                ${renderCheckRow('Has the work area been inspected for smoldering materials or residual heat?', data.h_heat_source)}
                ${renderCheckRow('Have all tools and hot work equipment been safely removed from the work area?', data.h_workplace_check)}
                ${renderCheckRow('Has the area been cleaned and restored to its original safe condition?', data.h_fire_detectors)}
                <tr>
                  <td>1hr Check time</td>
                  <td colspan="3">${data.h_start_time && data.h_start_time !== '1970' ? data.h_start_time : 'N/A'}</td>
                </tr>
                <tr>
                  <td>3hrs Check time</td>
                  <td colspan="3">${data.h_end_time && data.h_end_time !== '1970' ? data.h_end_time : 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `;
    })()}

      <!-- Temporary Site Electrical Systems Table -->
      ${(() => {
      const isElecActive = Number(data.working_on_electrical_system) === 1;
      if (!isElecActive) {
        return `
          <div class="dashboard-card" style="border-left: 4px solid #ef4444; background-color: #fafafa; opacity: 0.9;">
            <div class="detailed-section-title" style="margin-bottom: 0; border-bottom: none; padding-bottom: 0; display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <div style="display: flex; align-items: center;">
                ${imgElectricalSystems ? `<img src="${imgElectricalSystems}" style="height: 32px; vertical-align: middle; margin-right: 8px;">` : ''}
                <span style="color: #64748b;">Temporary Site Electrical Systems</span>
              </div>
              <span class="badge" style="background-color: #fee2e2; color: #ef4444; border: 1px solid #fecaca; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;">No</span>
            </div>
          </div>
        `;
      }
      return `
        <div class="dashboard-card" style="border-left: 4px solid #16a34a;">
          <div class="detailed-section-title" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center;">
              ${imgElectricalSystems ? `<img src="${imgElectricalSystems}" style="height: 32px; vertical-align: middle; margin-right: 8px;">` : ''}
              Temporary Site Electrical Systems
            </div>
            <span class="badge" style="background-color: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;">Yes</span>
          </div>
          <table class="detailed-table">
            <thead>
              <tr>
                <th>Question</th>
                <th class="check-cell">Yes</th>
                <th class="check-cell">No</th>
                <th class="check-cell">N/A</th>
              </tr>
            </thead>
            <tbody>
              ${electricalQuestions.map(q => renderCheckRow(q.text, data[q.id])).join('')}
            </tbody>
          </table>
        </div>
        `;
    })()}

      <!-- Working with Hazardous Substances/Chemicals -->
      ${(() => {
      const isChemActive = Number(data.working_hazardious_substen) === 1;
      if (!isChemActive) {
        return `
          <div class="dashboard-card" style="border-left: 4px solid #ef4444; background-color: #fafafa; opacity: 0.9;">
            <div class="detailed-section-title" style="margin-bottom: 0; border-bottom: none; padding-bottom: 0; display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <div style="display: flex; align-items: center;">
                ${imgSubstanceChemical ? `<img src="${imgSubstanceChemical}" style="height: 32px; vertical-align: middle; margin-right: 8px;">` : ''}
                <span style="color: #64748b;">Working with Hazardous Substances/Chemicals</span>
              </div>
              <span class="badge" style="background-color: #fee2e2; color: #ef4444; border: 1px solid #fecaca; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;">No</span>
            </div>
          </div>
        `;
      }
      return `
        <div class="dashboard-card" style="border-left: 4px solid #16a34a;">
          <div class="detailed-section-title" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center;">
              ${imgSubstanceChemical ? `<img src="${imgSubstanceChemical}" style="height: 32px; vertical-align: middle; margin-right: 8px;">` : ''}
              Working with Hazardous Substances/Chemicals
            </div>
            <span class="badge" style="background-color: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;">Yes</span>
          </div>
          <table class="detailed-table">
            <thead>
              <tr>
                <th>Question</th>
                <th class="check-cell">Yes</th>
                <th class="check-cell">No</th>
                <th class="check-cell">N/A</th>
              </tr>
            </thead>
            <tbody>
              ${chemicalQuestions.map(q => renderCheckRow(q.text, data[q.id])).join('')}
            </tbody>
          </table>
        </div>
        `;
    })()}

      <!-- Pressure Testing of Equipment -->
      ${(() => {
      if (data.permit_type !== 'Commissioning') return '';
      const isPressureActive = Number(data.pressure_testing_of_equipment) === 1;
      if (!isPressureActive) {
        return `
          <div class="dashboard-card" style="border-left: 4px solid #ef4444; background-color: #fafafa; opacity: 0.9;">
            <div class="detailed-section-title" style="margin-bottom: 0; border-bottom: none; padding-bottom: 0; display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <div style="display: flex; align-items: center;">
                ${imgTestingEquipment ? `<img src="${imgTestingEquipment}" style="height: 32px; vertical-align: middle; margin-right: 8px;">` : ''}
                <span style="color: #64748b;">Pressure Testing of Equipment</span>
              </div>
              <span class="badge" style="background-color: #fee2e2; color: #ef4444; border: 1px solid #fecaca; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;">No</span>
            </div>
          </div>
        `;
      }
      return `
        <div class="dashboard-card" style="border-left: 4px solid #16a34a;">
          <div class="detailed-section-title" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center;">
              ${imgTestingEquipment ? `<img src="${imgTestingEquipment}" style="height: 32px; vertical-align: middle; margin-right: 8px;">` : ''}
              Pressure Testing of Equipment
            </div>
            <span class="badge" style="background-color: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;">Yes</span>
          </div>
          <table class="detailed-table">
            <thead>
              <tr>
                <th>Question</th>
                <th class="check-cell">Yes</th>
                <th class="check-cell">No</th>
                <th class="check-cell">N/A</th>
              </tr>
            </thead>
            <tbody>
              ${pressureQuestions.map(q => renderCheckRow(q.text, data[q.id])).join('')}
            </tbody>
          </table>
        </div>
        `;
    })()}

      <!-- Working at Height -->
      ${(() => {
      const isHeightActive = Number(data.working_at_height) === 1;
      if (!isHeightActive) {
        return `
          <div class="dashboard-card" style="border-left: 4px solid #ef4444; background-color: #fafafa; opacity: 0.9;">
            <div class="detailed-section-title" style="margin-bottom: 0; border-bottom: none; padding-bottom: 0; display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <div style="display: flex; align-items: center;">
                ${imgWorkingAtHight ? `<img src="${imgWorkingAtHight}" style="height: 32px; vertical-align: middle; margin-right: 8px;">` : ''}
                <span style="color: #64748b;">Working at Height</span>
              </div>
              <span class="badge" style="background-color: #fee2e2; color: #ef4444; border: 1px solid #fecaca; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;">No</span>
            </div>
          </div>
        `;
      }
      return `
        <div class="dashboard-card" style="border-left: 4px solid #16a34a;">
          <div class="detailed-section-title" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center;">
              ${imgWorkingAtHight ? `<img src="${imgWorkingAtHight}" style="height: 32px; vertical-align: middle; margin-right: 8px;">` : ''}
              Working at Height
            </div>
            <span class="badge" style="background-color: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;">Yes</span>
          </div>
          <table class="detailed-table">
            <thead>
              <tr>
                <th>Question</th>
                <th class="check-cell">Yes</th>
                <th class="check-cell">No</th>
                <th class="check-cell">N/A</th>
              </tr>
            </thead>
            <tbody>
              ${heightQuestions.map(q => renderCheckRow(q.text, data[q.id])).join('')}
            </tbody>
          </table>
        </div>
        `;
    })()}

      <!-- Working in Confined Space -->
      ${(() => {
      const isConfinedActive = Number(data.working_confined_spaces) === 1;
      if (!isConfinedActive) {
        return `
          <div class="dashboard-card" style="border-left: 4px solid #ef4444; background-color: #fafafa; opacity: 0.9;">
            <div class="detailed-section-title" style="margin-bottom: 0; border-bottom: none; padding-bottom: 0; display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <div style="display: flex; align-items: center;">
                ${imgConfinedSpace ? `<img src="${imgConfinedSpace}" style="height: 32px; vertical-align: middle; margin-right: 8px;">` : ''}
                <span style="color: #64748b;">Working in Confined Space</span>
              </div>
              <span class="badge" style="background-color: #fee2e2; color: #ef4444; border: 1px solid #fecaca; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;">No</span>
            </div>
          </div>
        `;
      }
      return `
        <div class="dashboard-card" style="border-left: 4px solid #16a34a;">
          <div class="detailed-section-title" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center;">
              ${imgConfinedSpace ? `<img src="${imgConfinedSpace}" style="height: 32px; vertical-align: middle; margin-right: 8px;">` : ''}
              Working in Confined Space
            </div>
            <span class="badge" style="background-color: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;">Yes</span>
          </div>
          <table class="detailed-table">
            <thead>
              <tr>
                <th>Question</th>
                <th class="check-cell">Yes</th>
                <th class="check-cell">No</th>
                <th class="check-cell">N/A</th>
              </tr>
            </thead>
            <tbody>
              ${confinedQuestions.map(q => renderCheckRow(q.text, data[q.id])).join('')}
            </tbody>
          </table>
        </div>
        `;
    })()}

      <!-- Excavation Works -->
      ${(() => {
      const isExcavationActive = Number(data.excavation_works) === 1;
      if (!isExcavationActive) {
        return `
          <div class="dashboard-card" style="border-left: 4px solid #ef4444; background-color: #fafafa; opacity: 0.9;">
            <div class="detailed-section-title" style="margin-bottom: 0; border-bottom: none; padding-bottom: 0; display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <div style="display: flex; align-items: center;">
                ${imgExcavationWorks ? `<img src="${imgExcavationWorks}" style="height: 32px; vertical-align: middle; margin-right: 8px;">` : ''}
                <span style="color: #64748b;">Excavation Works</span>
              </div>
              <span class="badge" style="background-color: #fee2e2; color: #ef4444; border: 1px solid #fecaca; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;">No</span>
            </div>
          </div>
        `;
      }
      return `
        <div class="dashboard-card" style="border-left: 4px solid #16a34a;">
          <div class="detailed-section-title" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center;">
              ${imgExcavationWorks ? `<img src="${imgExcavationWorks}" style="height: 32px; vertical-align: middle; margin-right: 8px;">` : ''}
              Excavation Works
            </div>
            <span class="badge" style="background-color: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;">Yes</span>
          </div>
          <table class="detailed-table">
            <thead>
              <tr>
                <th>Question</th>
                <th class="check-cell">Yes</th>
                <th class="check-cell">No</th>
                <th class="check-cell">N/A</th>
              </tr>
            </thead>
            <tbody>
              ${excavationQuestions.map(q => renderCheckRow(q.text, data[q.id])).join('')}
            </tbody>
          </table>
        </div>
        `;
    })()}

      <!-- Crane and Lifting Operations -->
      ${(() => {
      const isLiftingActive = Number(data.using_cranes_or_lifting) === 1;
      if (!isLiftingActive) {
        return `
          <div class="dashboard-card" style="border-left: 4px solid #ef4444; background-color: #fafafa; opacity: 0.9;">
            <div class="detailed-section-title" style="margin-bottom: 0; border-bottom: none; padding-bottom: 0; display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <div style="display: flex; align-items: center;">
                ${imgCranesLifting ? `<img src="${imgCranesLifting}" style="height: 32px; vertical-align: middle; margin-right: 8px;">` : ''}
                <span style="color: #64748b;">Crane and Lifting Operations</span>
              </div>
              <span class="badge" style="background-color: #fee2e2; color: #ef4444; border: 1px solid #fecaca; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;">No</span>
            </div>
          </div>
        `;
      }
      return `
        <div class="dashboard-card" style="border-left: 4px solid #16a34a;">
          <div class="detailed-section-title" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center;">
              ${imgCranesLifting ? `<img src="${imgCranesLifting}" style="height: 32px; vertical-align: middle; margin-right: 8px;">` : ''}
              Crane and Lifting Operations
            </div>
            <span class="badge" style="background-color: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;">Yes</span>
          </div>
          <table class="detailed-table">
            <thead>
              <tr>
                <th>Question</th>
                <th class="check-cell">Yes</th>
                <th class="check-cell">No</th>
                <th class="check-cell">N/A</th>
              </tr>
            </thead>
            <tbody>
              ${liftingQuestions.map(q => renderCheckRow(q.text, data[q.id])).join('')}
            </tbody>
          </table>
        </div>
        `;
    })()}

      <!-- Energising, Isolating and Working on Live Electrical Systems -->
      ${(() => {
      if (data.permit_type !== 'Commissioning') return '';
      const isPowerActive = Number(data.power_on) === 1;
      const isEnergisingActive = isPowerActive && Number(data.energising_equipment) === 1;
      const isIsolatingActive = isPowerActive && Number(data.isolating_live) === 1;
      const isWorkingNearLiveActive = isPowerActive && Number(data.working_near_live) === 1;
      if (!isPowerActive) {
        return `
          <div class="dashboard-card" style="border-left: 4px solid #ef4444; background-color: #fafafa; opacity: 0.9;">
            <div class="detailed-section-title" style="margin-bottom: 0; border-bottom: none; padding-bottom: 0; display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <div style="display: flex; align-items: center;">
                ${imgElectricalWorks ? `<img src="${imgElectricalWorks}" style="height: 32px; vertical-align: middle; margin-right: 8px;">` : ''}
                <span style="color: #64748b;">Energising, Isolating & Working on Live Electrical Systems</span>
              </div>
              <span class="badge" style="background-color: #fee2e2; color: #ef4444; border: 1px solid #fecaca; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;">No</span>
            </div>
          </div>
        `;
      }
      return `
        <div class="dashboard-card" style="border-left: 4px solid #16a34a;">
          <div class="detailed-section-title" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center;">
              ${imgElectricalWorks ? `<img src="${imgElectricalWorks}" style="height: 32px; vertical-align: middle; margin-right: 8px;">` : ''}
              Energising, Isolating & Working on Live Electrical Systems
            </div>
            <span class="badge" style="background-color: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;">Yes</span>
          </div>

          <div class="font-weight-bold mt-2 mb-2" style="${isEnergisingActive ? '' : 'color: #64748b;'}">
            Sub-Section: Energising Electrical Equipment
            <span class="badge" style="margin-left: 6px; background-color: ${isEnergisingActive ? '#dcfce7' : '#fee2e2'}; color: ${isEnergisingActive ? '#16a34a' : '#ef4444'}; border: 1px solid ${isEnergisingActive ? '#bbf7d0' : '#fecaca'}; padding: 2px 8px; border-radius: 4px; font-size: 11px;">
              ${isEnergisingActive ? 'Yes' : 'No'}
            </span>
          </div>
          ${isEnergisingActive ? `
          <table class="detailed-table">
            <thead>
              <tr>
                <th>Question</th>
                <th class="check-cell">Yes</th>
                <th class="check-cell">No</th>
                <th class="check-cell">N/A</th>
              </tr>
            </thead>
            <tbody>
              ${energisingElecQuestions.map(q => renderCheckRow(q.text, data[q.id])).join('')}
            </tbody>
          </table>
          ` : ''}

          <div class="font-weight-bold mt-3 mb-2" style="${isIsolatingActive ? '' : 'color: #64748b;'}">
            Sub-Section: Isolating Live Electrical Systems for Maintenance or Modification
            <span class="badge" style="margin-left: 6px; background-color: ${isIsolatingActive ? '#dcfce7' : '#fee2e2'}; color: ${isIsolatingActive ? '#16a34a' : '#ef4444'}; border: 1px solid ${isIsolatingActive ? '#bbf7d0' : '#fecaca'}; padding: 2px 8px; border-radius: 4px; font-size: 11px;">
              ${isIsolatingActive ? 'Yes' : 'No'}
            </span>
          </div>
          ${isIsolatingActive ? `
          <table class="detailed-table">
            <thead>
              <tr>
                <th>Question</th>
                <th class="check-cell">Yes</th>
                <th class="check-cell">No</th>
                <th class="check-cell">N/A</th>
              </tr>
            </thead>
            <tbody>
              ${isolatingElecQuestions.map(q => renderCheckRow(q.text, data[q.id])).join('')}
            </tbody>
          </table>
          ` : ''}

          <div class="font-weight-bold mt-3 mb-2" style="${isWorkingNearLiveActive ? '' : 'color: #64748b;'}">
            Sub-Section: Working on OR near live electrical systems
            <span class="badge" style="margin-left: 6px; background-color: ${isWorkingNearLiveActive ? '#dcfce7' : '#fee2e2'}; color: ${isWorkingNearLiveActive ? '#16a34a' : '#ef4444'}; border: 1px solid ${isWorkingNearLiveActive ? '#bbf7d0' : '#fecaca'}; padding: 2px 8px; border-radius: 4px; font-size: 11px;">
              ${isWorkingNearLiveActive ? 'Yes' : 'No'}
            </span>
          </div>
          ${isWorkingNearLiveActive ? `
          <table class="detailed-table">
            <thead>
              <tr>
                <th>Question</th>
                <th class="check-cell">Yes</th>
                <th class="check-cell">No</th>
                <th class="check-cell">N/A</th>
              </tr>
            </thead>
            <tbody>
              ${workingNearLiveQuestions.map(q => renderCheckRow(q.text, data[q.id])).join('')}
            </tbody>
          </table>
          ` : ''}
        </div>
      `;
    })()}

      <!-- Energisation of Mechanical equipment -->
      ${(() => {
      if (data.permit_type !== 'Commissioning') return '';
      const isPressurizeActive = Number(data.pressurization) === 1;
      if (!isPressurizeActive) {
        return `
          <div class="dashboard-card" style="border-left: 4px solid #ef4444; background-color: #fafafa; opacity: 0.9;">
            <div class="detailed-section-title" style="margin-bottom: 0; border-bottom: none; padding-bottom: 0; display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <div style="display: flex; align-items: center;">
                ${imgMechanicalWorks ? `<img src="${imgMechanicalWorks}" style="height: 32px; vertical-align: middle; margin-right: 8px;">` : ''}
                <span style="color: #64748b;">Energisation of Mechanical equipment</span>
              </div>
              <span class="badge" style="background-color: #fee2e2; color: #ef4444; border: 1px solid #fecaca; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;">No</span>
            </div>
          </div>
        `;
      }
      return `
        <div class="dashboard-card" style="border-left: 4px solid #16a34a;">
          <div class="detailed-section-title" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center;">
              ${imgMechanicalWorks ? `<img src="${imgMechanicalWorks}" style="height: 32px; vertical-align: middle; margin-right: 8px;">` : ''}
              Energisation of Mechanical equipment
            </div>
            <span class="badge" style="background-color: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 800;">Yes</span>
          </div>
          <table class="detailed-table">
            <thead>
              <tr>
                <th>Question</th>
                <th class="check-cell">Yes</th>
                <th class="check-cell">No</th>
                <th class="check-cell">N/A</th>
              </tr>
            </thead>
            <tbody>
              ${mechanicalQuestions.map(q => renderCheckRow(q.text, data[q.id])).join('')}
            </tbody>
          </table>
        </div>
        `;
    })()}



      <!-- Approvals and Notes original signoffs -->
      <div class="dashboard-card">
        <div class="detailed-section-title">
          Detailed Approvals & Notes
        </div>
        <div class="row">
          <div class="col-md-6">
            ${approvalsHtml}
            <div class="info-label mt-2">The person responsible for this work</div>
            <div class="info-value">${data.ConM_initials1 || 'N/A'}</div>
          </div>
          <div class="col-md-6">
            <div class="info-label">Reject Reason</div>
            <div class="info-value mb-2">${data.reject_reason || 'N/A'}</div>
            <div class="info-label">Cancel Reason</div>
            <div class="info-value mb-2">${data.cancel_reason || 'N/A'}</div>
            <div class="info-label">Close Note</div>
            <div class="info-value">${data.close_note || 'N/A'}</div>
          </div>
        </div>
      </div>

      <!-- Upload Images Section (For Checkin/Checkout Picture popups) -->
      <div class="dashboard-card">
        <div class="detailed-section-title">
          Uploaded Check-in & Check-out Pictures
        </div>
        <div class="row">
          ${imagesHtml}
        </div>
      </div>

    </div>

    <!-- Download PDF Footer Button -->
    <div class="confirm-pg-download-container">
      <button class="confirm-pg-download-btn" onclick="test()">
        Download Official PDF
      </button>
    </div>

  </div>

  <!-- BootStrap & pdf generation scripts -->
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
  <script>
    function test() {
      // Hide buttons and controls before capture to keep the PDF clean
      const downloadContainer = document.querySelector('.confirm-pg-download-container');
      const headerActions = document.querySelector('.header-actions');
      const backBtn = document.querySelector('.back-btn');
      
      if (downloadContainer) downloadContainer.style.display = 'none';
      if (headerActions) headerActions.style.display = 'none';
      if (backBtn) backBtn.style.display = 'none';

      var element = document.getElementById('root');
      var name = "${data.PermitNo || 'Permit'}" + ".pdf";
      var opt = {
        margin: [10, 10, 10, 10],
        filename: name,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          windowWidth: 1280,
          scrollX: 0,
          scrollY: 0
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };
      
      html2pdf().set(opt).from(element).save().then(function() {
        // Restore controls visibility once download is completed
        if (downloadContainer) downloadContainer.style.display = 'block';
        if (headerActions) headerActions.style.display = 'flex';
        if (backBtn) backBtn.style.display = 'flex';
      });
    }
  </script>
</body>
</html>
  `;
}
