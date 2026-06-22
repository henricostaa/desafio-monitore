using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Monitori.Domain.Entities;
using Monitori.Domain.Enums;
using Monitori.Domain.Interfaces;
using Monitori.Infrastructure.Data;

namespace Monitori.Infrastructure.Repositories;

public class EmpreendimentoRepository : IEmpreendimentoRepository
{
    private readonly ApplicationDbContext _context;

    public EmpreendimentoRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Empreendimento empreendimento)
    {
        if (empreendimento == null) throw new ArgumentNullException(nameof(empreendimento));
        await _context.Empreendimentos.AddAsync(empreendimento);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Empreendimento empreendimento)
    {
        if (empreendimento == null) throw new ArgumentNullException(nameof(empreendimento));
        _context.Empreendimentos.Update(empreendimento);
        await _context.SaveChangesAsync();
    }

    public async Task<Empreendimento?> GetByIdAsync(Guid id)
    {
        return await _context.Empreendimentos.FirstOrDefaultAsync(e => e.Id == id);
    }

    public async Task<Empreendimento?> GetByCnpjAsync(string cnpj)
    {
        if (string.IsNullOrWhiteSpace(cnpj)) return null;
        return await _context.Empreendimentos.FirstOrDefaultAsync(e => e.CNPJ == cnpj);
    }

    public async Task<(IEnumerable<Empreendimento> Items, int TotalCount)> ListAsync(
        string? nome,
        StatusEmpreendimento? status,
        string? sortBy,
        string? sortOrder,
        int pageNumber,
        int pageSize)
    {
        var query = _context.Empreendimentos.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(nome))
        {
            string nomeLower = nome.ToLower();
            query = query.Where(e => e.Nome.ToLower().Contains(nomeLower));
        }

        if (status.HasValue)
        {
            query = query.Where(e => e.Status == status.Value);
        }

        int totalCount = await query.CountAsync();

        bool isDescending = string.Equals(sortOrder, "desc", StringComparison.OrdinalIgnoreCase);

        if (string.Equals(sortBy, "datacriacao", StringComparison.OrdinalIgnoreCase))
        {
            query = isDescending
                ? query.OrderByDescending(e => e.DataCriacao)
                : query.OrderBy(e => e.DataCriacao);
        }
        else
        {
            query = isDescending
                ? query.OrderByDescending(e => e.Nome)
                : query.OrderBy(e => e.Nome);
        }

        int skip = (pageNumber - 1) * pageSize;
        if (skip < 0) skip = 0;

        var items = await query
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }
}
