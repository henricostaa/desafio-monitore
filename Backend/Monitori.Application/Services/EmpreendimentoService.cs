using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Monitori.Application.DTOs;
using Monitori.Application.Interfaces;
using Monitori.Domain.Entities;
using Monitori.Domain.Exceptions;
using Monitori.Domain.Interfaces;

namespace Monitori.Application.Services;

public class EmpreendimentoService : IEmpreendimentoService
{
    private readonly IEmpreendimentoRepository _repository;

    public EmpreendimentoService(IEmpreendimentoRepository repository)
    {
        _repository = repository;
    }

    public async Task<EmpreendimentoDto> CreateAsync(CreateEmpreendimentoDto dto)
    {
        if (dto == null) throw new ArgumentNullException(nameof(dto));

        string apenasNumeros = new string(dto.CNPJ.Where(char.IsDigit).ToArray());

        var existente = await _repository.GetByCnpjAsync(apenasNumeros);
        if (existente != null)
        {
            throw new DomainException("Já existe um empreendimento cadastrado com este CNPJ.");
        }

        var empreendimento = new Empreendimento(dto.Nome, dto.CNPJ, dto.Endereco);

        await _repository.AddAsync(empreendimento);

        return MapToDto(empreendimento);
    }

    public async Task<EmpreendimentoDto> UpdateAsync(Guid id, UpdateEmpreendimentoDto dto)
    {
        if (dto == null) throw new ArgumentNullException(nameof(dto));

        var empreendimento = await _repository.GetByIdAsync(id);
        if (empreendimento == null)
        {
            throw new DomainException("Empreendimento não encontrado.");
        }

        empreendimento.AtualizarDados(dto.Nome, dto.Endereco);

        await _repository.UpdateAsync(empreendimento);

        return MapToDto(empreendimento);
    }

    public async Task InactivateAsync(Guid id)
    {
        var empreendimento = await _repository.GetByIdAsync(id);
        if (empreendimento == null)
        {
            throw new DomainException("Empreendimento não encontrado.");
        }

        empreendimento.Inativar();

        await _repository.UpdateAsync(empreendimento);
    }

    public async Task<EmpreendimentoDto?> GetByIdAsync(Guid id)
    {
        var empreendimento = await _repository.GetByIdAsync(id);
        return empreendimento == null ? null : MapToDto(empreendimento);
    }

    public async Task<PagedResultDto<EmpreendimentoDto>> GetPagedAsync(GetEmpreendimentosQuery query)
    {
        if (query == null) throw new ArgumentNullException(nameof(query));

        var (items, totalCount) = await _repository.ListAsync(
            query.Nome,
            query.Status,
            query.SortBy,
            query.SortOrder,
            query.PageNumber,
            query.PageSize);

        var dtos = items.Select(MapToDto);

        return new PagedResultDto<EmpreendimentoDto>(dtos, totalCount, query.PageNumber, query.PageSize);
    }

    private static EmpreendimentoDto MapToDto(Empreendimento entity)
    {
        return new EmpreendimentoDto
        {
            Id = entity.Id,
            Nome = entity.Nome,
            CNPJ = entity.CNPJ,
            Endereco = entity.Endereco,
            Status = entity.Status.ToString(),
            DataCriacao = entity.DataCriacao
        };
    }
}
