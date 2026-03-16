// ============================================================
// GOOGLE APPS SCRIPT — Salvar respostas do GeneAI no Google Sheets
// ============================================================
//
// COMO CONFIGURAR (passo a passo):
//
// 1. Acesse https://sheets.google.com e crie uma nova planilha
//    - Nomeie como "GeneAI - Respostas Validação"
//
// 2. Acesse https://script.google.com e crie um novo projeto
//    - Nomeie como "GeneAI Webhook"
//
// 3. Cole TODO o código abaixo no editor do Apps Script
//    - Substitua SPREADSHEET_ID pelo ID da sua planilha
//      (o ID está na URL da planilha: docs.google.com/spreadsheets/d/ESSE_E_O_ID/edit)
//
// 4. Clique em "Implantar" > "Nova implantação"
//    - Tipo: "App da Web"
//    - Executar como: "Eu"
//    - Quem tem acesso: "Qualquer pessoa"
//    - Clique em "Implantar"
//
// 5. Copie a URL gerada e cole no arquivo HTML na variável GOOGLE_SCRIPT_URL
//
// 6. Pronto! Cada resposta do formulário será uma nova linha na planilha.
//
// ============================================================

const SPREADSHEET_ID = 'COLE_O_ID_DA_SUA_PLANILHA_AQUI';

// Colunas que serão criadas na planilha (na ordem)
const COLUMNS = [
  'timestamp',
  'contact_name',
  'contact_email',
  'contact_whatsapp',
  'specialty',
  'institution',
  'institution_other',
  'patients_week',
  'team',
  'team_size',
  'pain_ranking',
  'pain_missing',
  'admin_vs_clinical',
  'missed_hypothesis',
  'current_tools',
  'current_tools_other',
  'lab_report_format',
  'lab_report_format_other',
  'post_report_workflow',
  'uses_ai',
  'ai_details',
  'tools_likes',
  'tools_frustrations',
  'paid_software',
  'paid_software_details',
  'interest_score',
  'feature_ranking',
  'feature_missing',
  'lab_import_feedback',
  'required_databases',
  'required_databases_other',
  'ai_trust',
  'ai_trust_details',
  'pedigree_useful',
  'pedigree_tool',
  'integration_need',
  'privacy_requirement',
  'privacy_other',
  'willingness_to_pay',
  'purchase_decision',
  'purchase_decision_other',
  'adoption_triggers',
  'platform_preference',
  'open_feedback'
];

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();

    // Criar cabeçalho se a planilha estiver vazia
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUMNS);
      sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    const data = JSON.parse(e.postData.contents);

    // Montar linha na ordem das colunas
    const row = COLUMNS.map(col => {
      if (col === 'timestamp') {
        return data._timestamp || new Date().toISOString();
      }
      const value = data[col];
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      return value || '';
    });

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Permitir requisições GET para teste
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'GeneAI Webhook ativo!' }))
    .setMimeType(ContentService.MimeType.JSON);
}
