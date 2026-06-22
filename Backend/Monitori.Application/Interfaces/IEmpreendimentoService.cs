using System;
using System.Threading.Tasks;
using Monitori.Application.DTOs;

namespace Monitori.Application.Interfaces;

public interface IEmpreendimentoService
{
    Task<EmpreendimentoDto> CreateAsync(CreateEmpreendimentoDto dto);
    Task<EmpreendimentoDto> UpdateAsync(Guid id, UpdateEmpreendimentoDto dto);
    Task InactivateAsync(Guid id);
    Task<EmpreendimentoDto?> GetByIdAsync(Guid id);
    Task<PagedResultDto<EmpreendimentoDto>> GetPagedAsync(GetEmpreendimentosQuery query);
}
