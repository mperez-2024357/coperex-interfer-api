import ExcelJS from 'exceljs';
import { Company } from '../companies/company.model.js';


export const generateCompaniesExcel = async (_req, res) => {
  try {
    const companies = await Company.find().lean();

    if (!companies || companies.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No hay empresas registradas para generar el reporte',
      });
    }

    const workbook = new ExcelJS.Workbook();
    const COLORS = {
      primary: '1F4E78',
      secondary: '4472C4',
      tertiary: 'D9E1F2',
      accent: 'FFC000',
      gray: 'E7E6E6',
      white: 'FFFFFF',
      black: '000000',
      impactLow: 'C6EFCE',
      impactMid: 'FFEB9C',
      impactHigh: 'FFC7CE',
      impactVeryHigh: 'FF0000',
    };

    const fechaGeneracion = new Date();
    const fechaFormateada = fechaGeneracion.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const createTitleStyle = () => ({
      font: { bold: true, size: 32, color: { argb: COLORS.white }, name: 'Calibri' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.primary } },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    });

    const createSubtitleStyle = () => ({
      font: { bold: true, size: 20, color: { argb: COLORS.primary }, name: 'Calibri' },
      alignment: { horizontal: 'center', vertical: 'center' },
    });

    const createHeaderSectionStyle = () => ({
      font: { bold: true, size: 14, color: { argb: COLORS.white }, name: 'Calibri' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.primary } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
        left: { style: 'medium', color: { argb: COLORS.primary } },
        right: { style: 'medium', color: { argb: COLORS.primary } },
        top: { style: 'medium', color: { argb: COLORS.primary } },
        bottom: { style: 'medium', color: { argb: COLORS.primary } },
      },
    });

    const createHeaderTableStyle = () => ({
      font: { bold: true, size: 11, color: { argb: COLORS.white }, name: 'Calibri' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.secondary } },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: {
        left: { style: 'thin', color: { argb: COLORS.primary } },
        right: { style: 'thin', color: { argb: COLORS.primary } },
        top: { style: 'thin', color: { argb: COLORS.primary } },
        bottom: { style: 'thin', color: { argb: COLORS.primary } },
      },
    });

    const createCellStyle = (fillColor = null) => ({
      font: { size: 10, name: 'Calibri', color: { argb: COLORS.black } },
      alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
      border: {
        left: { style: 'thin', color: { argb: COLORS.gray } },
        right: { style: 'thin', color: { argb: COLORS.gray } },
        top: { style: 'thin', color: { argb: COLORS.gray } },
        bottom: { style: 'thin', color: { argb: COLORS.gray } },
      },
      ...(fillColor && {
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } },
      }),
    });

    const createImpactStyle = (impact) => {
      let color = COLORS.black;
      let bgColor = COLORS.white;

      switch (impact) {
        case 'Bajo':
          bgColor = COLORS.impactLow;
          break;
        case 'Medio':
          bgColor = COLORS.impactMid;
          break;
        case 'Alto':
          bgColor = COLORS.impactHigh;
          break;
        case 'Muy Alto':
          bgColor = COLORS.impactVeryHigh;
          color = COLORS.white;
          break;
      }

      return {
        font: { size: 10, name: 'Calibri', color: { argb: color } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: {
          left: { style: 'thin', color: { argb: COLORS.gray } },
          right: { style: 'thin', color: { argb: COLORS.gray } },
          top: { style: 'thin', color: { argb: COLORS.gray } },
          bottom: { style: 'thin', color: { argb: COLORS.gray } },
        },
      };
    };

    const sheetPortada = workbook.addWorksheet('Portada');
    sheetPortada.pageSetup = {
      paperSize: 1,
      orientation: 'portrait',
      fitToPage: true,
      fitToHeight: 1,
      fitToWidth: 1,
    };
    sheetPortada.margins = {
      left: 0.7,
      right: 0.7,
      top: 0.75,
      bottom: 0.75,
      header: 0.3,
      footer: 0.3,
    };

    sheetPortada.columns = [
      { width: 20 },
      { width: 50 },
      { width: 20 },
    ];

    sheetPortada.getRow(1).height = 40;
    sheetPortada.getRow(2).height = 20;

    sheetPortada.mergeCells('A3:C3');
    const titleCell = sheetPortada.getCell('A3');
    titleCell.value = 'FERIA INTERFER - COPEREX';
    titleCell.style = createTitleStyle();
    sheetPortada.getRow(3).height = 50;

    sheetPortada.mergeCells('A4:C4');
    const accentCell = sheetPortada.getCell('A4');
    accentCell.style = {
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.accent } },
    };
    sheetPortada.getRow(4).height = 8;

    sheetPortada.mergeCells('A5:C5');
    const subtitleCell = sheetPortada.getCell('A5');
    subtitleCell.value = 'Reporte Integral de Empresas Registradas';
    subtitleCell.style = createSubtitleStyle();
    sheetPortada.getRow(5).height = 30;

    sheetPortada.getRow(6).height = 20;

    sheetPortada.mergeCells('A7:C7');
    const infoHeaderCell = sheetPortada.getCell('A7');
    infoHeaderCell.value = 'INFORMACIÓN DEL REPORTE';
    infoHeaderCell.style = {
      font: { bold: true, size: 14, color: { argb: COLORS.primary }, name: 'Calibri' },
      alignment: { horizontal: 'center', vertical: 'center' },
    };
    sheetPortada.getRow(7).height = 25;

    const infoStyle = {
      font: { bold: true, size: 12, color: { argb: COLORS.primary }, name: 'Calibri' },
      alignment: { horizontal: 'left', vertical: 'center' },
    };
    const valueStyle = {
      font: { size: 12, color: { argb: COLORS.black }, name: 'Calibri' },
      alignment: { horizontal: 'left', vertical: 'center' },
    };

    const empresasActivas = companies.filter(c => c.status === 'Activo').length;
    const categoriasUnicas = [...new Set(companies.map(c => c.businessCategory).filter(Boolean))].length;
    sheetPortada.getCell('B9').value = 'Fecha de Generación:';
    sheetPortada.getCell('B9').style = infoStyle;
    sheetPortada.getCell('C9').value = fechaFormateada;
    sheetPortada.getCell('C9').style = valueStyle;

    sheetPortada.getCell('B10').value = 'Total de Empresas:';
    sheetPortada.getCell('B10').style = infoStyle;
    sheetPortada.getCell('C10').value = companies.length;
    sheetPortada.getCell('C10').style = valueStyle;

    sheetPortada.getCell('B11').value = 'Empresas Activas:';
    sheetPortada.getCell('B11').style = infoStyle;
    sheetPortada.getCell('C11').value = empresasActivas;
    sheetPortada.getCell('C11').style = valueStyle;

    sheetPortada.getCell('B12').value = 'Categorías Únicas:';
    sheetPortada.getCell('B12').style = infoStyle;
    sheetPortada.getCell('C12').value = categoriasUnicas;
    sheetPortada.getCell('C12').style = valueStyle;

    sheetPortada.mergeCells('A15:C15');
    const footerCell = sheetPortada.getCell('A15');
    footerCell.value = 'COPEREX - Feria Internacional de Empresas';
    footerCell.style = {
      font: { size: 10, color: { argb: COLORS.secondary }, name: 'Calibri', italic: true },
      alignment: { horizontal: 'center', vertical: 'center' },
    };

    sheetPortada.printArea = 'A1:C15';

    const sheetIndice = workbook.addWorksheet('Índice');
    sheetIndice.pageSetup = {
      paperSize: 1,
      orientation: 'portrait',
    };
    sheetIndice.margins = {
      left: 0.7,
      right: 0.7,
      top: 0.75,
      bottom: 0.75,
      header: 0.3,
      footer: 0.3,
    };

    sheetIndice.columns = [
      { width: 8 },
      { width: 35 },
      { width: 50 },
    ];

    sheetIndice.mergeCells('A1:C1');
    const indexHeaderCell = sheetIndice.getCell('A1');
    indexHeaderCell.value = 'ÍNDICE DE CONTENIDOS';
    indexHeaderCell.style = createHeaderSectionStyle();
    sheetIndice.getRow(1).height = 30;

    sheetIndice.getRow(2).height = 15;

    const indiceItems = [
      { num: 1, titulo: 'Portada', descripcion: 'Información general del reporte' },
      { num: 2, titulo: 'Índice', descripcion: 'Contenido del documento' },
      { num: 3, titulo: 'Datos de Empresas', descripcion: 'Listado completo con todos los registros' },
      { num: 4, titulo: 'Análisis y Estadísticas', descripcion: 'Desgloses, métricas y matriz de categoría vs impacto' },
    ];

    let rowIdx = 3;
    indiceItems.forEach((item) => {
      const indexStyle = {
        font: { size: 11, name: 'Calibri', color: { argb: COLORS.primary } },
        alignment: { horizontal: 'left', vertical: 'center' },
      };
      const indexNumStyle = {
        font: { bold: true, size: 11, name: 'Calibri', color: { argb: COLORS.primary } },
        alignment: { horizontal: 'center', vertical: 'center' },
      };

      sheetIndice.getCell(`A${rowIdx}`).value = item.num;
      sheetIndice.getCell(`A${rowIdx}`).style = indexNumStyle;

      sheetIndice.getCell(`B${rowIdx}`).value = item.titulo;
      sheetIndice.getCell(`B${rowIdx}`).style = indexStyle;

      sheetIndice.getCell(`C${rowIdx}`).value = item.descripcion;
      sheetIndice.getCell(`C${rowIdx}`).style = indexStyle;

      sheetIndice.getRow(rowIdx).height = 22;
      rowIdx++;
    });

    sheetIndice.printArea = `A1:C${rowIdx - 1}`;
    sheetIndice.footer = '&P de &N';

    const hojaDatos = workbook.addWorksheet('Datos de Empresas');
    hojaDatos.pageSetup = {
      paperSize: 1,
      orientation: 'landscape',
    };
    hojaDatos.margins = {
      left: 0.7,
      right: 0.7,
      top: 0.75,
      bottom: 0.75,
      header: 0.3,
      footer: 0.3,
    };

    const headers = [
      'N°',
      'Empresa',
      'Categoría',
      'Años Exp.',
      'Nivel Impacto',
      'Contacto',
      'Email',
      'Teléfono',
      'Sitio Web',
      'Estado',
      'Descripción',
      'Fecha Registro',
    ];

    const columnWidths = [6, 25, 15, 10, 14, 18, 28, 14, 25, 10, 45, 14];

    hojaDatos.columns = columnWidths.map(width => ({ width }));

    const headerRow = hojaDatos.addRow(headers);
    headers.forEach((_, idx) => {
      headerRow.getCell(idx + 1).style = createHeaderTableStyle();
    });
    hojaDatos.getRow(1).height = 25;

    hojaDatos.views = [{ state: 'frozen', ySplit: 1 }];

    companies.forEach((company, idx) => {
      const row = hojaDatos.addRow([
        idx + 1,
        company.name || '',
        company.businessCategory || '',
        company.yearsOfExperience || 0,
        company.impactLevel || '',
        company.contactPerson || '',
        company.email || '',
        company.phone || '',
        company.website || '',
        company.status || 'Activo',
        company.description || '',
        company.registrationDate 
          ? new Date(company.registrationDate).toLocaleDateString('es-ES')
          : '',
      ]);

      const isAlternate = idx % 2 === 1;
      row.eachCell((cell, colNumber) => {
        if (colNumber === 5) {
          cell.style = createImpactStyle(company.impactLevel);
        } else {
          cell.style = createCellStyle(isAlternate ? COLORS.tertiary : null);
        }
      });

      row.height = 20;
    });

    hojaDatos.autoFilter = `A1:L${companies.length + 1}`;

    hojaDatos.printArea = `A1:L${companies.length + 1}`;
    hojaDatos.footer = '&P de &N';

    const hojaAnalisis = workbook.addWorksheet('Análisis y Estadísticas');
    hojaAnalisis.pageSetup = {
      paperSize: 1,
      orientation: 'portrait',
    };
    hojaAnalisis.margins = {
      left: 0.7,
      right: 0.7,
      top: 0.75,
      bottom: 0.75,
      header: 0.3,
      footer: 0.3,
    };

    hojaAnalisis.columns = [
      { width: 30 },
      { width: 18 },
      { width: 18 },
      { width: 18 },
    ];

    let rowNum = 1;

    hojaAnalisis.mergeCells(`A${rowNum}:D${rowNum}`);
    const analysisHeaderCell = hojaAnalisis.getCell(`A${rowNum}`);
    analysisHeaderCell.value = 'ANÁLISIS Y ESTADÍSTICAS';
    analysisHeaderCell.style = createHeaderSectionStyle();
    hojaAnalisis.getRow(rowNum).height = 30;
    rowNum += 2;

    hojaAnalisis.mergeCells(`A${rowNum}:D${rowNum}`);
    const summaryHeaderCell = hojaAnalisis.getCell(`A${rowNum}`);
    summaryHeaderCell.value = 'RESUMEN GENERAL';
    summaryHeaderCell.style = createHeaderSectionStyle();
    hojaAnalisis.getRow(rowNum).height = 25;
    rowNum++;

    const summaryItems = [
      { label: 'Total de Empresas', value: companies.length },
      { label: 'Empresas Activas', value: empresasActivas, percent: ((empresasActivas / companies.length) * 100).toFixed(1) },
    ];

    summaryItems.forEach((item, idx) => {
      const style = idx % 2 === 0 ? createCellStyle() : createCellStyle(COLORS.tertiary);

      hojaAnalisis.getCell(`A${rowNum}`).value = item.label;
      hojaAnalisis.getCell(`A${rowNum}`).style = style;

      hojaAnalisis.getCell(`B${rowNum}`).value = item.value;
      hojaAnalisis.getCell(`B${rowNum}`).style = style;

      if (item.percent) {
        hojaAnalisis.getCell(`C${rowNum}`).value = `${item.percent}%`;
        hojaAnalisis.getCell(`C${rowNum}`).style = style;
      }

      rowNum++;
    });

    rowNum += 2;

    hojaAnalisis.mergeCells(`A${rowNum}:D${rowNum}`);
    const categoryHeaderCell = hojaAnalisis.getCell(`A${rowNum}`);
    categoryHeaderCell.value = 'DESGLOSE POR CATEGORÍA';
    categoryHeaderCell.style = createHeaderSectionStyle();
    hojaAnalisis.getRow(rowNum).height = 25;
    rowNum++;

    const categoryTableRow = hojaAnalisis.getRow(rowNum);
    categoryTableRow.getCell(1).value = 'Categoría';
    categoryTableRow.getCell(1).style = createHeaderTableStyle();
    categoryTableRow.getCell(2).value = 'Cantidad';
    categoryTableRow.getCell(2).style = createHeaderTableStyle();
    categoryTableRow.getCell(3).value = 'Porcentaje';
    categoryTableRow.getCell(3).style = createHeaderTableStyle();
    rowNum++;

    const categoryCounts = {};
    companies.forEach((c) => {
      const cat = c.businessCategory || 'Sin categoría';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const categoriasOrdenadas = Object.keys(categoryCounts).sort();
    categoriasOrdenadas.forEach((categoria, idx) => {
      const count = categoryCounts[categoria];
      const porcentaje = ((count / companies.length) * 100).toFixed(1);
      const style = idx % 2 === 0 ? createCellStyle() : createCellStyle(COLORS.tertiary);

      hojaAnalisis.getCell(`A${rowNum}`).value = categoria;
      hojaAnalisis.getCell(`A${rowNum}`).style = style;

      hojaAnalisis.getCell(`B${rowNum}`).value = count;
      hojaAnalisis.getCell(`B${rowNum}`).style = style;

      hojaAnalisis.getCell(`C${rowNum}`).value = `${porcentaje}%`;
      hojaAnalisis.getCell(`C${rowNum}`).style = style;

      rowNum++;
    });

    rowNum += 2;

    hojaAnalisis.mergeCells(`A${rowNum}:D${rowNum}`);
    const impactHeaderCell = hojaAnalisis.getCell(`A${rowNum}`);
    impactHeaderCell.value = 'DESGLOSE POR NIVEL DE IMPACTO';
    impactHeaderCell.style = createHeaderSectionStyle();
    hojaAnalisis.getRow(rowNum).height = 25;
    rowNum++;

    const impactTableRow = hojaAnalisis.getRow(rowNum);
    impactTableRow.getCell(1).value = 'Nivel de Impacto';
    impactTableRow.getCell(1).style = createHeaderTableStyle();
    impactTableRow.getCell(2).value = 'Cantidad';
    impactTableRow.getCell(2).style = createHeaderTableStyle();
    impactTableRow.getCell(3).value = 'Porcentaje';
    impactTableRow.getCell(3).style = createHeaderTableStyle();
    rowNum++;

    const impactCounts = {};
    companies.forEach((c) => {
      const impact = c.impactLevel || 'Sin especificar';
      impactCounts[impact] = (impactCounts[impact] || 0) + 1;
    });

    const ordenImpacto = ['Bajo', 'Medio', 'Alto', 'Muy Alto'];
    let impactRowCount = 0;
    ordenImpacto.forEach((impact) => {
      if (impactCounts[impact] !== undefined) {
        const count = impactCounts[impact];
        const porcentaje = ((count / companies.length) * 100).toFixed(1);
        const style = impactRowCount % 2 === 0 ? createCellStyle() : createCellStyle(COLORS.tertiary);

        hojaAnalisis.getCell(`A${rowNum}`).value = impact;
        hojaAnalisis.getCell(`A${rowNum}`).style = style;

        hojaAnalisis.getCell(`B${rowNum}`).value = count;
        hojaAnalisis.getCell(`B${rowNum}`).style = style;

        hojaAnalisis.getCell(`C${rowNum}`).value = `${porcentaje}%`;
        hojaAnalisis.getCell(`C${rowNum}`).style = style;

        impactRowCount++;
        rowNum++;
      }
    });

    Object.keys(impactCounts).forEach((impact) => {
      if (!ordenImpacto.includes(impact)) {
        const count = impactCounts[impact];
        const porcentaje = ((count / companies.length) * 100).toFixed(1);
        const style = impactRowCount % 2 === 0 ? createCellStyle() : createCellStyle(COLORS.tertiary);

        hojaAnalisis.getCell(`A${rowNum}`).value = impact;
        hojaAnalisis.getCell(`A${rowNum}`).style = style;

        hojaAnalisis.getCell(`B${rowNum}`).value = count;
        hojaAnalisis.getCell(`B${rowNum}`).style = style;

        hojaAnalisis.getCell(`C${rowNum}`).value = `${porcentaje}%`;
        hojaAnalisis.getCell(`C${rowNum}`).style = style;

        impactRowCount++;
        rowNum++;
      }
    });

    rowNum += 2;

    hojaAnalisis.mergeCells(`A${rowNum}:D${rowNum}`);
    const yearsHeaderCell = hojaAnalisis.getCell(`A${rowNum}`);
    yearsHeaderCell.value = 'ESTADÍSTICAS - AÑOS DE EXPERIENCIA';
    yearsHeaderCell.style = createHeaderSectionStyle();
    hojaAnalisis.getRow(rowNum).height = 25;
    rowNum++;

    const yearsValues = companies.map(c => c.yearsOfExperience || 0);
    const sumaYears = yearsValues.reduce((a, b) => a + b, 0);
    const promedioYears = (sumaYears / yearsValues.length).toFixed(1);
    const maxYears = Math.max(...yearsValues);
    const minYears = Math.min(...yearsValues);

    const yearsOrdenados = [...yearsValues].sort((a, b) => a - b);
    const mitad = Math.floor(yearsOrdenados.length / 2);
    const medianaYears = yearsOrdenados.length % 2 !== 0
      ? yearsOrdenados[mitad]
      : ((yearsOrdenados[mitad - 1] + yearsOrdenados[mitad]) / 2).toFixed(1);

    const varianza = yearsValues.reduce((acc, val) => acc + Math.pow(val - promedioYears, 2), 0) / yearsValues.length;
    const desviacionEstandar = Math.sqrt(varianza).toFixed(1);

    const yearsTableRow = hojaAnalisis.getRow(rowNum);
    yearsTableRow.getCell(1).value = 'Métrica';
    yearsTableRow.getCell(1).style = createHeaderTableStyle();
    yearsTableRow.getCell(2).value = 'Valor';
    yearsTableRow.getCell(2).style = createHeaderTableStyle();
    yearsTableRow.getCell(3).value = 'Descripción';
    yearsTableRow.getCell(3).style = createHeaderTableStyle();
    rowNum++;

    const metricas = [
      { nombre: 'Promedio', valor: promedioYears, desc: 'Media aritmética' },
      { nombre: 'Mediana', valor: medianaYears, desc: 'Valor central' },
      { nombre: 'Máximo', valor: maxYears, desc: 'Mayor valor' },
      { nombre: 'Mínimo', valor: minYears, desc: 'Menor valor' },
      { nombre: 'Desviación Estándar', valor: desviacionEstandar, desc: 'Dispersión promedio' },
    ];

    metricas.forEach((metrica, idx) => {
      const style = idx % 2 === 0 ? createCellStyle() : createCellStyle(COLORS.tertiary);

      hojaAnalisis.getCell(`A${rowNum}`).value = metrica.nombre;
      hojaAnalisis.getCell(`A${rowNum}`).style = style;

      hojaAnalisis.getCell(`B${rowNum}`).value = parseFloat(metrica.valor);
      hojaAnalisis.getCell(`B${rowNum}`).style = style;

      hojaAnalisis.getCell(`C${rowNum}`).value = metrica.desc;
      hojaAnalisis.getCell(`C${rowNum}`).style = style;

      rowNum++;
    });

    rowNum += 2;

    hojaAnalisis.mergeCells(`A${rowNum}:E${rowNum}`);
    const matrixHeaderCell = hojaAnalisis.getCell(`A${rowNum}`);
    matrixHeaderCell.value = 'MATRIZ CRUZADA: CATEGORÍA vs NIVEL DE IMPACTO (TABLA DINÁMICA EQUIVALENTE)';
    matrixHeaderCell.style = createHeaderSectionStyle();
    hojaAnalisis.getRow(rowNum).height = 25;
    rowNum++;

    const impactsList = ['Bajo', 'Medio', 'Alto', 'Muy Alto'];
    const matrixHeaderRow = hojaAnalisis.getRow(rowNum);
    matrixHeaderRow.getCell(1).value = 'Categoría';
    matrixHeaderRow.getCell(1).style = createHeaderTableStyle();

    impactsList.forEach((impact, idx) => {
      matrixHeaderRow.getCell(2 + idx).value = impact;
      matrixHeaderRow.getCell(2 + idx).style = createHeaderTableStyle();
    });

    matrixHeaderRow.getCell(6).value = 'Total';
    matrixHeaderRow.getCell(6).style = createHeaderTableStyle();
    rowNum++;

    categoriasOrdenadas.forEach((categoria, idx) => {
      const style = idx % 2 === 0 ? createCellStyle() : createCellStyle(COLORS.tertiary);

      hojaAnalisis.getCell(`A${rowNum}`).value = categoria;
      hojaAnalisis.getCell(`A${rowNum}`).style = style;

      let totalFila = 0;
      impactsList.forEach((impact, impIdx) => {
        const count = companies.filter(
          c => c.businessCategory === categoria && c.impactLevel === impact
        ).length;
        totalFila += count;

        hojaAnalisis.getCell(rowNum, 2 + impIdx).value = count;
        hojaAnalisis.getCell(rowNum, 2 + impIdx).style = style;
      });

      hojaAnalisis.getCell(`F${rowNum}`).value = totalFila;
      hojaAnalisis.getCell(`F${rowNum}`).style = style;

      rowNum++;
    });

    const totalRow = hojaAnalisis.getRow(rowNum);
    totalRow.getCell(1).value = 'Total';
    totalRow.getCell(1).style = createHeaderTableStyle();

    let totalGeneral = 0;
    impactsList.forEach((impact, idx) => {
      const count = companies.filter(c => c.impactLevel === impact).length;
      totalGeneral += count;
      totalRow.getCell(2 + idx).value = count;
      totalRow.getCell(2 + idx).style = createHeaderTableStyle();
    });

    totalRow.getCell(6).value = totalGeneral;
    totalRow.getCell(6).style = createHeaderTableStyle();
    totalRow.height = 22;

    hojaAnalisis.printArea = `A1:F${rowNum}`;
    hojaAnalisis.pageSetup = {
      paperSize: 1,
      orientation: 'landscape',
    };
    hojaAnalisis.margins = {
      left: 0.7,
      right: 0.7,
      top: 0.75,
      bottom: 0.75,
      header: 0.3,
      footer: 0.3,
    };
    hojaAnalisis.footer = '&P de &N';

    const buffer = await workbook.xlsx.writeBuffer();
    const fechaISO = fechaGeneracion.toISOString().split('T')[0];
    const filename = `Reporte_Empresas_Interfer_${fechaISO}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);

  } catch (error) {
    console.error('Error al generar reporte Excel:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al generar el reporte Excel',
      error: error.message,
    });
  }
};