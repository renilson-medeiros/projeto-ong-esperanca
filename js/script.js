// Módulo de validação de formulários
const FormValidator = {
  patterns: {
    cpf: value => value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .substring(0, 14),
      
    telefone: value => value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 15),
      
    cep: value => value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 9),
      
    dataNascimento: value => value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .substring(0, 10)
  },

  validationRules: {
    cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    telefone: /^\(\d{2}\)\s\d{5}-\d{4}$/,
    cep: /^\d{5}-\d{3}$/,
    dataNascimento: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/
  },

  validateField(input) {
    const value = input.value.trim();
    const fieldType = input.id;

    if (input.required && !value) {
      this.showError(input, "Campo obrigatório");
      return false;
    }

    if (this.validationRules[fieldType] && !this.validationRules[fieldType].test(value)) {
      this.showError(input, `Formato inválido`);
      return false;
    }

    if (fieldType === 'dataNascimento' && !this.isValidDate(value)) {
      this.showError(input, "Data inválida");
      return false;
    }

    this.removeError(input);
    return true;
  },

  isValidDate(dateString) {
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    
    return date.getDate() === day && 
           date.getMonth() === month - 1 && 
           date.getFullYear() === year &&
           date <= new Date();
  },

  showError(input, message) {
    const errorDiv = this.getErrorDiv(input);
    errorDiv.textContent = message;
    input.classList.add('error');
  },

  removeError(input) {
    const errorDiv = this.getErrorDiv(input);
    errorDiv.textContent = '';
    input.classList.remove('error');
  },

  getErrorDiv(input) {
    let errorDiv = input.nextElementSibling;
    if (!errorDiv?.classList.contains('error-message')) {
      errorDiv = document.createElement('div');
      errorDiv.classList.add('error-message');
      input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }
    return errorDiv;
  }
};

// Módulo de máscaras
const FormMasks = {
    patterns: {
        cpf(value) {
            return value
                .replace(/\D/g, '')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                .substring(0, 14);
        },
        telefone(value) {
            return value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2')
                .substring(0, 15);
        },
        cep(value) {
            return value
                .replace(/\D/g, '')
                .replace(/(\d{5})(\d)/, '$1-$2')
                .substring(0, 9);
        },
        dataNascimento(value) {
            return value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '$1/$2')
                .replace(/(\d{2})(\d)/, '$1/$2')
                .substring(0, 10);
        }
    },

    maskInput(input) {
        const fieldType = input.id;
        if (this.patterns[fieldType]) {
            input.value = this.patterns[fieldType](input.value);
        }
    }
};

// Inicialização e eventos
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (form) {
    // Aplica máscaras durante digitação
    form.addEventListener('input', (e) => {
      const input = e.target;
      const fieldType = input.id;
      
      if (FormMasks.patterns[fieldType]) {
        const cursorPosition = input.selectionStart;
        const oldLength = input.value.length;
        
        input.value = FormMasks.patterns[fieldType](input.value);
        
        const newLength = input.value.length;
        if (cursorPosition < oldLength) {
          input.setSelectionRange(cursorPosition, cursorPosition);
        }
      }
    });

    // Valida campos quando perdem foco
    form.addEventListener('blur', (e) => {
      if (e.target.tagName === 'INPUT') {
        FormValidator.validateField(e.target);
      }
    }, true);

    // Valida formulário no envio
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      form.querySelectorAll('input').forEach(input => {
        if (!FormValidator.validateField(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        console.log('Formulário válido, enviando dados...');
        alert('Cadastro realizado com sucesso!');
        form.reset();
      }
    });
  }

  // Aplica máscaras aos campos
  const maskedInputs = form.querySelectorAll('#cpf, #telefone, #cep, #dataNascimento');
  
  maskedInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      FormMasks.maskInput(e.target);
    });
  });
});

const handleInput = (e) => {
    const input = e.target;
    const value = input.value.replace(/\D/g, '');
    
    switch (input.id) {
        case 'cpf':
            if (value.length <= 11) {
                input.value = value
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d)/, '$1-$2');
            }
            break;
            
        case 'telefone':
            if (value.length <= 11) {
                input.value = value
                    .replace(/(\d{2})(\d)/, '($1) $2')
                    .replace(/(\d{5})(\d)/, '$1-$2');
            }
            break;
            
        case 'cep':
            if (value.length <= 8) {
                input.value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            break;
            
        case 'dataNascimento':
            if (value.length <= 8) {
                input.value = value
                    .replace(/(\d{2})(\d)/, '$1/$2')
                    .replace(/(\d{2})(\d)/, '$1/$2');
            }
            break;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('#cpf, #telefone, #cep, #dataNascimento');
    inputs.forEach(input => {
        input.addEventListener('input', handleInput);
    });

    // Máscara para CPF
    const cpfElement = document.getElementById('cpf');
    IMask(cpfElement, {
        mask: '000.000.000-00'
    });

    // Máscara para telefone
    const telefoneElement = document.getElementById('telefone');
    IMask(telefoneElement, {
        mask: '(00) 00000-0000'
    });

    // Máscara para CEP
    const cepElement = document.getElementById('cep');
    IMask(cepElement, {
        mask: '00000-000'
    });

    // Máscara para data
    const dataElement = document.getElementById('dataNascimento');
    IMask(dataElement, {
        mask: '00/00/0000'
    });
});
